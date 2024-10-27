var express = require('express');
var router = express.Router();
const { createUser } = require('../services/user-service');
const ApiError = require('../utils/api-error');


/* Create a new user */
router.post('/register', async function (req, res, next) {
  const { name, email, password } = req.body;
  try {
    const token = await createUser({ name, email, password });
    res.status(201).json({ success: true, message: "User registered successfully", token });

  } catch (err) {  
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({
        status: 'error',
        message: err.message,
        errors: err.errors,
      });
    } else {
      res.status(500).json({ status: 'error', message: 'Server error' });
    }
  }
});

module.exports = router;
