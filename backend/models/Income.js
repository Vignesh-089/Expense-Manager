const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
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
    default: 'Income',
  },
}, { timestamps: true });

module.exports = mongoose.model('income', incomeSchema);
