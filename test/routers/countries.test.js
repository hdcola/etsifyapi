const request = require('supertest');
const express = require('express');
const appSetup = require('../../appSetup');
const { fetchCountries } = require('../../services/countries-service');

const app = express();
appSetup(app);
jest.mock('../../services/countries-service');

describe('GET /api/countries', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return a list of countries', async () => {
        const mockCountries = [
        { country_id: 1, name: 'Canada', code: 'CA' },
        { country_id: 2, name: 'United States', code: 'US' },
    ];
    fetchCountries.mockResolvedValue(mockCountries);
        const response = await request(app).get('/api/countries');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('allCountries');
        expect(Array.isArray(response.body.allCountries)).toBe(true);
        expect(response.body.allCountries).toEqual(mockCountries);
    });

    it('should return an error when fetching countries fails', async () => {
        fetchCountries.mockRejectedValue(new Error('Database error')); 

        const response = await request(app).get('/api/countries');

        expect(response.status).toBe(500); 
        expect(response.body).toHaveProperty('message', 'Internal Server Error'); 
    });
});
