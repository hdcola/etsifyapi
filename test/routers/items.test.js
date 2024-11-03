const request = require('supertest');
const express = require('express');
const appSetup = require('../../appSetup');
const { items } = require('../../models');
const { Sequelize } = require('sequelize');
const { generateToken } = require('../../middlewares/jwt');
const { getStoreForUser } = require('../../services/stores-service'); 

const app = express();
appSetup(app);
jest.mock('../../models');
jest.mock('../../services/stores-service');

describe('POST /api/items/add', () => {
    let token;
    let userId = 1;
    beforeEach(() => {
        token = generateToken({ userId: userId });
        getStoreForUser.mockResolvedValue({
            store_id: 1,
            user_id: userId,
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('it should create an item and return a success message', async () => {
        items.findOne.mockResolvedValueOnce(null); 
        items.create.mockResolvedValueOnce({
            item_id: 1,
            name: 'Test Item',
            description: 'Test Description',
            store_id: 1,
        });
        
        const response = await request(app)
            .post('/api/items/add')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Test Item', description: 'Test Description' });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Item created successfully');
    });

    it('should return 500 Internal Server Error when database connection fails', async () => {
        items.create.mockRejectedValueOnce(new Sequelize.ConnectionError());

        const response = await request(app)
            .post('/api/items/add')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Test Item', description: 'Test Description' });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Database connection failed');
    });

});