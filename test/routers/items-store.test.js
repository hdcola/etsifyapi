const request = require('supertest');
const express = require('express');
const appSetup = require('../../appSetup');
const { stores, items } = require('../../models');
const { Sequelize } = require('sequelize');
const { generateToken } = require('../../middlewares/jwt');
const { getStoreForUser } = require('../../services/stores-service');

const app = express();
appSetup(app);
jest.mock('../../services/stores-service');
jest.mock('../../models');

describe('POST /api/stores/items', () => {
    let token;
    let userId = 1;
    let store_id = 1;

    beforeEach(() => {
        token = generateToken({ userId: userId });
        getStoreForUser.mockResolvedValue({
            store_id: store_id,
            name: 'Test Store',
            user_id: userId,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    // name, description, image_url, quantity, price
    it('should create an item and return a success message', async () => {
        items.findOne.mockResolvedValueOnce(null);
        items.create.mockResolvedValueOnce({
            item_id: 1,
            name: 'Test Item',
            description: 'Test Description',
            store_id: 1,
            image_url: 'image.jpg',
            quantity: 1,
            price: 1,
        });

        const response = await request(app)
            .post('/api/stores/items')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Test Item', description: 'Test Description' });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Item created successfully');
    });
/*
    it('should return 500 Internal Server Error when database connection fails', async () => {
        const SequelizeConnectionError = new Sequelize.ConnectionError(
            'Database connection failed'
        );
        items.create.mockRejectedValue(
            new Sequelize.ConnectionError('Database connection failed')
        );

        const response = await request(app)
            .post('/api/stores/items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test Item',
                description: 'Test Description',
                store_id: 1,
                image_url: 'image.jpg',
                quantity: 1,
                price: 1,
            });

        console.log(response);
        expect(response.status).toBe(500);
        expect(response.body.message).toBe(
            'Database connection failed'
        );
    });*/
});
