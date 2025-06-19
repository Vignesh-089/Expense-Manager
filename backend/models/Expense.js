const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
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
    type: Date,
    required: true,
  },
  screenName: {
    type: String,
    default: 'Expense',
  },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
