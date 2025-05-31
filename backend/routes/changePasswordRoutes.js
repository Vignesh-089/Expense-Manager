const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();
router.post('/changePassword', async (req, res) => {
  try {
    const { name, oldPassword, newPassword } = req.body;

    // Validate input
    if (!name || !oldPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Find the user
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Old password is incorrect.' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
