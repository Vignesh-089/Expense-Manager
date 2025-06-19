const express = require('express');
const UserDetails = require('../models/UserDetails');
const authenticateUser = require('../middleware/authMiddleware');

const router = express.Router();

router.put('/createUser', authenticateUser, async (req, res) => {
  const { name, dob, email, type, mobileNo, location, address, gender } = req.body;
  const userId = req.user.userId;

  if (!name || !dob || !email || !type || !mobileNo || !location || !address || !gender) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Find user details by userId
    let user = await UserDetails.findOne({ userId });

    if (user) {
      // Update user details
      user.name = name;
      user.dob = dob;
      user.email = email;
      user.type = type;
      user.mobileNo = mobileNo;
      user.location = location;
      user.address = address;
      user.gender = gender;
      await user.save();

      return res.status(200).json({
        message: 'User updated successfully',
        userDetails: user,
      });
    } else {
      // Create user details
      const newUser = new UserDetails({
        name,
        dob,
        email,
        type,
        mobileNo,
        location,
        address,
        gender,
        userId,
      });
      await newUser.save();

      return res.status(201).json({
        message: 'User created successfully',
        userDetails: newUser,
      });
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.get('/getAllUserDetails', authenticateUser, async (req, res) => {
  try {
    const users = await UserDetails.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/getUserById/:id', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await UserDetails.findOne({ _id: req.params.id, userId });

    if (!user) return res.status(404).json({ error: 'User not found or unauthorized' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

router.get('/getUserProfileDetails', authenticateUser, async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) {
      filter.type = req.query.type;
    }

    const profiles = await UserDetails.find(filter);
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
