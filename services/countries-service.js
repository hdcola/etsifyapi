const { countries } = require('../models');
const ApiError = require('../utils/api-error');

async function fetchCountries() {
    try {
        const allCountries  =  await countries.findAll();
        return allCountries; 
    } catch (err) {
        throw ApiError.badRequest('Failed to fetch stores');
    }
};

module.exports = { fetchCountries };