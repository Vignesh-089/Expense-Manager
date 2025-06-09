const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  date: {
    type: String,  // You can use Date if you're storing it as a Date object
    required: true,
  },
  screenName: {
    type: String,
    default: 'Expense',  // Optional: you can make this required if you prefer
  },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
