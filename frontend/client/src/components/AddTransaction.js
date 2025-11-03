import React, { useState } from 'react';
import API from '../services/api';

export default function AddTransaction({ onAdded }) {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) {
      alert('Amount and category are required!');
      return;
    }

    try {
      setLoading(true);
      await API.post('/transactions', {
        type: formData.type,
        amount: Number(formData.amount),
        category: formData.category.trim(),
        date: new Date(),
        notes: formData.notes.trim(),
      });

      // Reset form
      setFormData({ type: 'expense', amount: '', category: '', notes: '' });

      // Refresh transaction list
      onAdded && onAdded();
    } catch (err) {
      console.error(err);
      alert('Failed to add transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      style={{
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        marginBottom: 20,
      }}
    >
      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        disabled={loading}
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        placeholder="Amount"
        disabled={loading}
        required
      />

      <input
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Category"
        disabled={loading}
        required
      />

      <input
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Notes (optional)"
        disabled={loading}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}
