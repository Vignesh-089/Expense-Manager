const express = require('express');
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const authenticateUser = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/getAllExpenseAmount', authenticateUser, async (req, res) => {
    const screenName = req.query.screenName || 'Expense';
    const userId = req.user.userId;

    try {
        const expenses = await Expense.find({ screenName, userId });
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

router.get('/getAllIncomeAmount', authenticateUser, async (req, res) => {
    const screenName = req.query.screenName || 'Income';
    const userId = req.user.userId;

    try {
        const income = await Income.find({ screenName, userId });
        const totalAmount = income.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

        res.json({
            screenName,
            income,
            totalAmount: totalAmount.toFixed(2)
        });
    } catch (err) {
        console.error('Error fetching income:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/getAllBalanceAmount', authenticateUser, async (req, res) => {
    const userId = req.user.userId;

    try {
        const incomeList = await Income.find({ userId });
        const expenseList = await Expense.find({ userId });

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

router.get('/getAllTransactionDetails', authenticateUser, async (req, res) => {
    const { startDate, endDate } = req.query;
    const userId = req.user.userId;

    let dateFilter = { userId };
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.date = { $gte: start, $lte: end };
    }

    try {
        const income = await Income.find(dateFilter);
        const expense = await Expense.find(dateFilter);

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

router.get('/getTopExpenses', authenticateUser, async (req, res) => {
    const userId = req.user.userId;

    try {
        const topExpenses = await Expense.find({ userId })
            .sort({ amount: -1 })
            .limit(5);

        res.json({ topExpenses });
    } catch (err) {
        console.error('Error fetching top 5 expenses:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/getTopIncome', authenticateUser, async (req, res) => {
    const userId = req.user.userId;

    try {
        const topIncome = await Income.find({ userId })
            .sort({ amount: -1 })
            .limit(5);

        res.json({ topIncome });
    } catch (error) {
        console.error('Error fetching top 5 income:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
