const express = require('express');
const authenticateUser = require('../middleware/authMiddleware');
const Expense = require('../models/Expense');

const router = express.Router();

router.put('/createOrUpdateExpense', authenticateUser, async (req, res) => {
  const { category, amount, method, date } = req.body;
  const userId = req.user.userId;

  if (!category || !amount || !method || !date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    let expense = await Expense.findOne({ category, userId });

    if (expense) {
      expense.amount = amount;
      expense.method = method;
      expense.date = date;
      expense.screenName = 'Expense';
      await expense.save();

      return res.status(200).json({
        message: 'Expense updated successfully',
        expenseDetails: expense,
      });
    } else {
      const newExpense = new Expense({
        category,
        amount,
        method,
        date,
        screenName: 'Expense',
        userId,
      });

      await newExpense.save();

      return res.status(201).json({
        message: 'Expense created successfully',
        expenseDetails: newExpense,
      });
    }
  } catch (error) {
    console.error('Error creating/updating expense:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.get('/getAllExpenseDetails', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const expenses = await Expense.find({ userId });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/getExpenseDetailsById/:id', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const expenseDetails = await Expense.findOne({ _id: req.params.id, userId });

    if (!expenseDetails) {
      return res.status(404).json({ error: 'Expense not found or unauthorized' });
    }

    res.json(expenseDetails);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
