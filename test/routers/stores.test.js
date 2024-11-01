const request = require('supertest');
const express = require('express');
const appSetup = require('../../appSetup');
const { stores } = require('../../models');
const { Sequelize } = require('sequelize');

const app = express();
appSetup(app);
jest.mock('../../models');

describe('POST /api/stores/', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('it should create a store and return a success message', async () => {
        stores.findOne.mockResolvedValue(null);
        stores.create.mockResolvedValue({
            store_id: 1,
            country_id: 1,
            name: 'TestStore',
            description: 'testDescription',
            user_id: 1,
        });

        const response = await request(app).post('/api/stores/').send({
            country_id: 1,
            name: 'TestStore',
            description: 'testDescription',
            user_id: 1,
        });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('success', true);
    });

    it('it should fail if user already has a store', async () => {
        stores.findOne.mockResolvedValue({
            store_id: 1,
            country_id: 1,
            name: 'ExistingStore',
            description: 'existingDescription',
            user_id: 1,
        });

        const response = await request(app).post('/api/stores/').send({
            country_id: 1,
            name: 'NewStore',
            description: 'newDescription',
            user_id: 1,
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            'message',
            'User already has a store'
        );
    });

    it('should return 500 Internal Server Error when database connection fails', async () => {
        stores.findOne.mockResolvedValue(null);
        stores.create.mockRejectedValue(
            new Sequelize.ConnectionError('Database connection failed')
        );

        const response = await request(app).post('/api/stores/').send({
            country_id: 1,
            name: 'TestStore',
            description: 'testDescription',
            user_id: 1,
        });

        console.log(response);
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty(
            'message',
            'Database connection failed'
        );
    });
});

describe('GET /api/stores/:store_id', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and the store details if the store exists', async () => {
        const mockStore = {
            store_id: 1,
            name: 'Test Store',
            description: 'A description of the test store',
            country_id: 101,
            user_id: 15,
        };

        stores.findOne.mockResolvedValue(mockStore);
        const response = await request(app).get(
            `/api/stores/${mockStore.store_id}`
        );

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('store');
        expect(response.body.store).toMatchObject(mockStore);
    });

    it('should return 404 if the store does not exist', async () => {
        stores.findOne.mockResolvedValue(null);
        const store_id_nonexistent = Number.MAX_SAFE_INTEGER;
        const response = await request(app).get(
            `/api/stores/${store_id_nonexistent}`
        );

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', 'Store not found');
    });

    it('should return 500 Internal Server Error when database connection fails', async () => {
        const SequelizeConnectionError = new Sequelize.ConnectionError(
            'Database connection failed'
        );
        SequelizeConnectionError.name = 'SequelizeConnectionError';
        stores.findOne.mockRejectedValue(SequelizeConnectionError);
        const response = await request(app).get('/api/stores/1');
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('status', 'error'); 
        expect(response.body).toHaveProperty('message', 'Database connection failed');
        expect(response.body).not.toHaveProperty('errors');
    });
});

// TODO: get the list of stores
// TODO: add if user doesn't exist in database
// TODO: add if country id doesn't exist in database