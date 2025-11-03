import React from 'react';
import API from '../services/api';

export default function TxList({ transactions, onChanged }) {
  async function remove(id) {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await API.delete(`/transactions/${id}`);
      onChanged();
    } catch (err) {
      console.error(err);
      alert('Error deleting transaction.');
    }
  }

  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        background: 'var(--card-color, #fff)',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflowX: 'auto',
      }}
    >
      <h3 style={{ marginBottom: '10px', color: '#333' }}>Transactions 💰</h3>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '14px',
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: '#f3f4f6',
              borderBottom: '2px solid #e5e7eb',
            }}
          >
            <th style={{ padding: '10px' }}>Type</th>
            <th style={{ padding: '10px' }}>Amount</th>
            <th style={{ padding: '10px' }}>Category</th>
            <th style={{ padding: '10px' }}>Date</th>
            <th style={{ padding: '10px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '15px', color: '#777' }}>
                No transactions yet.
              </td>
            </tr>
          ) : (
            transactions.map((t) => (
              <tr
                key={t._id}
                style={{
                  borderBottom: '1px solid #eee',
                  backgroundColor:
                    t.type === 'income'
                      ? 'rgba(34,197,94,0.1)'
                      : 'rgba(239,68,68,0.1)',
                }}
              >
                <td style={{ padding: '10px', color: t.type === 'income' ? '#22c55e' : '#ef4444' }}>
                  {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                </td>
                <td style={{ padding: '10px' }}>₹ {t.amount}</td>
                <td style={{ padding: '10px' }}>{t.category}</td>
                <td style={{ padding: '10px' }}>
                  {new Date(t.date).toLocaleDateString()}
                </td>
                <td style={{ padding: '10px' }}>
                  <button
                    onClick={() => remove(t._id)}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
