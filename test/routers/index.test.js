const request = require('supertest');
const express = require('express');
const router = require('../../routes/index');

const app = express();
app.use('/', router);

describe('GET / sample test', () => {
    it('should return a JSON response with a welcome message', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Welcome to the API' });
    });
});
