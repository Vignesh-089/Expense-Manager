const express = require('express');
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const authenticateUser = require('../middleware/authMiddleware');

const router = express.Router();

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

router.get('/getMonthWiseValue', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get only logged-in user's data
    const expenses = await Expense.find({ userId }).select('amount date -_id');
    const incomes = await Income.find({ userId }).select('amount date -_id');

    const monthData = {};

    // Initialize all months
    for (let i = 0; i < 12; i++) {
      monthData[i] = { month: monthNames[i], expense: 0, income: 0 };
    }

    // Aggregate expenses
    expenses.forEach(({ amount, date }) => {
      const month = new Date(date).getMonth();
      monthData[month].expense += amount;
    });

    // Aggregate incomes
    incomes.forEach(({ amount, date }) => {
      const month = new Date(date).getMonth();
      monthData[month].income += amount;
    });

    // Return sorted array
    const finalData = Object.values(monthData);
    res.json(finalData);
  } catch (err) {
    console.error('Error fetching monthly report:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
