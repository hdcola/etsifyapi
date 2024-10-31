const express = require('express');
const router = express.Router();
const { fetchCountries } = require('../services/countries-service');

router.get('/', async (req, res, next) => {
    try {
        const allCountries = await fetchCountries();
        res.status(200).json({ success: true, allCountries });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
