const express = require('express');
const UserDetails = require('../models/UserDetails');

const router = express.Router();

// PUT /createOrUpdateUser
router.put('/createUser', async (req, res) => {
    const { name, dob, email, type, mobileNo, location, address, gender } = req.body;

    if (!name || !dob || !email || !type || !mobileNo || !location || !address || !gender) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Case-insensitive email check
        let user = await UserDetails.findOne({ email: { $regex: `^${email}$`, $options: 'i' } });

        if (user) {
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
                userDetails: user
            });
        } else {
            const newUser = new UserDetails({ name, dob, email, type, mobileNo, location, address, gender });
            await newUser.save();

            return res.status(201).json({
                message: 'User created successfully',
                userDetails: newUser
            });
        }
    } catch (error) {
        console.error('Error creating/updating user:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});


router.get('/getAllUserDetails', async (req, res) => {
    try {
        const users = await UserDetails.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user details by ID
router.get('/getUserById/:id', async (req, res) => {
    try {
        const user = await UserDetails.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

router.get('/getUserProfileDetails', async (req, res) => {
    try {
        const filter={};
        if(req.query.type) {
            filter.type = req.query.type;
        }
        const profileDetails = await UserDetails.find(filter);
        res.json(profileDetails);
    } catch (error) {
        res.status(500).json({ error: 'Server error' })
    }
})


module.exports = router;
