const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'], // Optional: restrict gender options
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('UserDetails', userDetailsSchema);
