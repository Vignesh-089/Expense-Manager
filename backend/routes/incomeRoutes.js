const express = require('express');

const authenticateUser = require('../middleware/authMiddleware');
const Income = require('../models/Income');

const router = express.Router();

router.put('/createOrUpdateIncome', authenticateUser, async (req, res) => {
    const { category, amount, method, date } = req.body;
    const userId = req.user.userId;

    if (!category || !amount || !method || !date) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Find expense by category
        let income = await Income.findOne({ category, userId });

        if (income) {
            // Update existing expense
            income.amount = amount;
            income.method = method;
            income.date = date;
            income.screenName = 'Income';
            await income.save();

            return res.status(200).json({
                message: 'Income updated successfully',
                incomeDetails: income
            });
        } else {
            // Create new expense
            const newIncome = new Income({ category, amount, method, date, screenName: 'Income', userId });
            await newIncome.save();

            return res.status(200).json({
                message: 'Income created successfully',
                incomeDetails: newIncome
            });
        }
    } catch (error) {
        console.error('Error creating/updating income:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});


router.get('/getAllIncomeDetails', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.userId;
        const income = await Income.find({ userId });
        res.json(income);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/getIncomeDetailsById/:id', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.userId;
        const incomeDetails = await Income.findById({ _id: req.params.id, userId });
        if (!incomeDetails) return res.status(404).json({ error: 'Income not found' });
        res.json(incomeDetails);
    } catch (error) {
        res.status(500).json({ error: 'server error' })
    }
})

module.exports = router;
