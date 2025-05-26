require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

// Middleware to handlecors
app.use(
    cors({
        origin: process.env.CLIENT_URL || '*',
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json());

connectDB();

// Import your auth routes
const authRoutes = require('./routes/authRoutes');

// Mount auth routes under /auth
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Running on the port ${PORT}`));
