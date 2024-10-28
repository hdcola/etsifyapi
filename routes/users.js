var express = require('express');
var router = express.Router();
const { createUser, login } = require('../services/user-service');
const ApiError = require('../utils/api-error');

/* Create a new user */
router.post('/register', async function (req, res, next) {
    const { username, full_name, email, password } = req.body;
    try {
        const token = await createUser({ username, full_name, email, password });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
        });
    } catch (err) {
        next(err);
    }
});

/* Login */
router.post('/login', async function (req, res, next) {
    const { email, password } = req.body;
    try {
        const token = await login({email, password});
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token
        })
    } catch (err) {
        next(err);
    }
});

module.exports = router;
