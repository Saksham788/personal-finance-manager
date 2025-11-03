const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
// const generateFinanceReport = require('../utils/generateReport');

// 🟢 Get all transactions for user
router.get('/', auth, async (req, res) => {
  try {
    const tx = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(tx);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).send('Server error');
  }
});

// 🟢 Get expense summary by category
router.get('/summary', auth, async (req, res) => {
  try {
    const tx = await Transaction.find({ user: req.user.id });
    const byCategory = {};
    tx.forEach(t => {
      if (t.type === 'expense') {
        byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
      }
    });
    res.json({ transactions: tx, byCategory });
  } catch (err) {
    console.error('Error generating summary:', err);
    res.status(500).send('Server error');
  }
});

// 🟢 Create a new transaction
router.post('/', auth, async (req, res) => {
  try {
    const { type, amount, category, date, notes } = req.body;

    if (!type || !amount || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newTx = new Transaction({
      user: req.user.id,
      type,
      amount,
      category,
      date,
      notes
    });

    const saved = await newTx.save();
    res.json(saved);
  } catch (err) {
    console.error('Error creating transaction:', err);
    res.status(500).send('Server error');
  }
});

// 🟢 Update a transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).send('Transaction not found');
    if (tx.user.toString() !== req.user.id)
      return res.status(401).send('Unauthorized');

    Object.assign(tx, req.body);
    await tx.save();

    res.json({ message: 'Transaction updated successfully', tx });
  } catch (err) {
    console.error('Error updating transaction:', err);
    res.status(500).send('Server error');
  }
});

// 🟢 Delete a transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    if (tx.user.toString() !== req.user.id)
      return res.status(401).json({ message: 'Unauthorized' });

    await tx.deleteOne();
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(500).json({ message: err.message });
  }
});

// 🟢 Download PDF Report
router.get('/download-report', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found to generate report' });
    }

    const filePath = generateFinanceReport(transactions);
    res.download(filePath, 'finance-report.pdf');
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ message: 'Error generating report' });
  }
});

module.exports = router;
