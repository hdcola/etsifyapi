const express = require('express');
const router = express.Router();
const appSetup = require('../appSetup');
const { fetchCountries } = require('../services/countries-service');


console.log('Countries router loaded');

router.get('/', async (req, res, next) => {
    console.log('Received request for /api/countries');
    try {
        const allCountries = await fetchCountries();
        res.status(200).json({ success: true, allCountries });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
