const express = require('express');
const Expense = require('../models/Expense');
const Income = require('../models/Income');

const router = express.Router();

router.get('/getAllExpenseAmount', async (req, res) => {
    const screenName = req.query.screenName || 'Expense'; // Default to "Expense" if not provided

    try {
        const expenses = await Expense.find({ screenName });

        const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

        res.json({
            screenName,
            totalAmount: totalAmount.toFixed(2),
            expenses
        });
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/getAllIncomeAmount', async (req, res) => {
    const screenName = req.query.screenName || 'Income';
    try {
        const income = await Income.find({ screenName });

        const totalAmount = income.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

        res.json({
            screenName,
            income,
            totalAmount: totalAmount.toFixed(2),

        });
    } catch (err) {
        console.error('Error fetching income:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/getAllBalanceAmount', async (req, res) => {
    try {
        const incomeList = await Income.find({});
        const expenseList = await Expense.find({});

        const totalIncome = incomeList.reduce((sum, inc) => sum + parseFloat(inc.amount || 0), 0);
        const totalExpense = expenseList.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

        const balance = totalIncome - totalExpense;

        res.json({
            screenName: 'Balance',
            totalIncome: totalIncome.toFixed(2),
            totalExpense: totalExpense.toFixed(2),
            balance: balance.toFixed(2)
        });
    } catch (err) {
        console.error('Error calculating balance:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/getAllTransactionDetails', async (req, res) => {
    try {
        const income = await Income.find({});
        const expense = await Expense.find({});

        const formattedIncome = income.map(tx => ({
            ...tx._doc,
            type: 'Income',
            date: new Date(tx.date)
        }));

        const formattedExpense = expense.map(tx => ({
            ...tx._doc,
            type: 'Expense',
            date: new Date(tx.date)
        }));
        
        const allTransactions = [...formattedIncome, ...formattedExpense].sort(
            (a, b) => b.date - a.date
        );

        res.json({
            screenName: 'All Transactions',
            transactions: allTransactions
        });
    } catch (err) {
        console.error('Error fetching transaction details:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
