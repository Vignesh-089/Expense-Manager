const express = require('express');

const Expense = require('../models/Expense');

const router = express.Router();

router.put('/createOrUpdateExpense', async (req, res) => {
    const { category, amount, method, date } = req.body;

    if (!category || !amount || !method || !date) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Find expense by category
        let expense = await Expense.findOne({ category });

        if (expense) {
            // Update existing expense
            expense.amount = amount;
            expense.method = method;
            expense.date = date;
            await expense.save();

            return res.status(200).json({
                message: 'Expense updated successfully',
                expenseDetails: expense
            });
        } else {
            // Create new expense
            const newExpense = new Expense({ category, amount, method, date });
            await newExpense.save();

            return res.status(201).json({
                message: 'Expense created successfully',
                expenseDetails: newExpense
            });
        }
    } catch (error) {
        console.error('Error creating/updating expense:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});


router.get('/getAllExpenseDetails', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/getExpenseDetailsById/:id', async (req, res) => {
    try {
        const expenseDetails = await Expense.findById(req.params.id);
        if (!expenseDetails) return res.status(404).json({ error: 'Expense not found' });
        res.json(expenseDetails);
    } catch (error) {
        res.status(500).json({ error: 'server error' })
    }
})

module.exports = router;
