const express = require('express');
const { userModel } = require('../models/User.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { registerValidators, loginVaidators } = require('../middlewares/validators');

const authRouter = express.Router();

const COOKIE_EXPIRATION = 30 * 24 * 60 * 60 * 1000;

authRouter.post('/register', async (req, res) => {
    try {
        const validateData = registerValidators.safeParse(req.body);

        if (!validateData.success) {
            return res.status(400).json({
                message: "Invalid data",
                errors: validateData.error.errors
            });
        }

        const { email, password } = validateData.data;

        const existingData = await userModel.findOne({ email });
        if (existingData) {
            return res.status(400).json({
                message: 'User already exists with same email ID.'
            });
        }

        const user = new userModel({ email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully.' });

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: error.message });
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const validateData = loginVaidators.safeParse(req.body);

        if (!validateData.success) {
            return res.status(400).json({
                message: "Invalid data",
                errors: validateData.error.errors
            });
        }
        

        const { email, password } = validateData.data;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password." });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '30d' });
        res.cookie('authToken', token, {
            httpOnly: true,
            maxAge: COOKIE_EXPIRATION,
        });
        

        res.status(200).json({
            message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

authRouter.post('/logout', (req, res) => {
    try{
        res.clearCookie('authToken', {httpOnly:true, sameSite:'strict'});
        return res.status(200).json({
            message:'Logout successfully'
        })

    }catch(error){
        res.status(401).json({
            error: error.message,
            message: "Error occured in Logout api"
        })
    }
    
});

authRouter.get('/verify', (req, res) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        res.status(200).json({
            valid: true,
            userId: verified.id
        });
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
});

module.exports = { authRouter };
