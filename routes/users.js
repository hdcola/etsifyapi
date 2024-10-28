var express = require('express');
var router = express.Router();
const { createUser } = require('../services/user-service');
const ApiError = require('../utils/api-error');

/* Create a new user */
router.post('/register', async function (req, res, next) {
    const { username, email, password } = req.body;
    try {
        const token = await createUser({ username, email, password });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
