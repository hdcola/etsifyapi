const request = require('supertest');
const express = require('express');
const appSetup = require('../../appSetup');
const { stores } = require('../../models');
const { Sequelize } = require('sequelize');

const app = express();
appSetup(app);

jest.mock('../../models');

describe('POST /api/store/', () => {
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

        const response = await await request(app)
            .post('/api/store/')
            .send({
                country_id: 1,
                name: 'TestStore',
                description: 'testDescription',
                user_id: 1
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('success', true);
    });

    it('it should fail if user already has a store', async () =>{
        stores.findOne.mockResolvedValue({
            store_id: 1,
            country_id: 1,
            name: 'ExistingStore',
            description: 'existingDescription',
            user_id: 1,
        });

        const response = await request(app)
            .post('/api/store/')
            .send({
                country_id: 1,
                name: 'NewStore',
                description: 'newDescription',
                user_id: 1
            });       
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'User already has a store');
    });

    it('should return 500 Internal Server Error when database connection fails', async () => {
        stores.findOne.mockResolvedValue(null); 
        stores.create.mockRejectedValue(new Sequelize.ConnectionError('Database connection failed'));

        const response = await request(app)
            .post('/api/store/')
            .send({
                country_id: 1,
                name: 'TestStore',
                description: 'testDescription',
                user_id: 1
            });

        console.log(response); 
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Database connection failed');
    });

});

// TODO: get by id, get the list of stores
