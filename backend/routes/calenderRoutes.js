const express = require('express');
const Expense = require('../models/Expense');
const Income = require('../models/Income');

const router = express.Router();

// Get all expense records for calendar view
router.get('/getAllExpenseCalender', async (req, res) => {
    try {
        const expenses = await Expense.find()
            .select('amount date screenName -_id');

        res.json({ expenses });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all income records for calendar view
router.get('/getAllIncomeCalender', async (req, res) => {
    try {
        const income = await Income.find()
            .select('amount date screenName -_id');

        res.json({ income });
    } catch (error) {
        console.error('Error fetching income:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
