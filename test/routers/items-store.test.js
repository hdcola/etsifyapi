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
jest.mock('../../models', () => {
    return {
        stores: {
            findOne: jest.fn(),
        },
        items: {
            findOne: jest.fn(),
            create: jest.fn(),
            deleteItemForStore: jest.fn(), 
            editItemForStore: jest.fn(),    
        },
    };
});

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


describe('DELETE /api/stores/items/:itemId', () => {
    let token;
    let userId = 1;
    
    beforeEach(() => {
        token = generateToken({ userId: userId });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should delete an item and return a success message', async () => {
        const itemId = 1;
        const mockStore = { store_id: 1 };
        
        stores.findOne.mockResolvedValue(mockStore);
        items.deleteItemForStore = jest.fn().mockResolvedValue(); 

        const response = await request(app)
            .delete(`/api/stores/items/${itemId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(204);
    });
/* 
    it('should return 404 if the store is not found', async () => {
        const itemId = 1;
    
        stores.findOne.mockResolvedValue(null);
    
        const response = await request(app)
            .delete(`/api/stores/items/${itemId}`)
            .set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', 'Store not found or unauthorized');
    });
    
    it('should return 403 if the user is not authorized', async () => {
        const itemId = 1;
        const mockStore = { store_id: 2 }; 
    
        stores.findOne.mockResolvedValue(mockStore); 
    
        const response = await request(app)
            .delete(`/api/stores/items/${itemId}`)
            .set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', 'Store not found or unauthorized');
    });
     
    it('should return 500 Internal Server Error when database connection fails', async () => {
        const itemId = 1;
        const mockStore = { store_id: 1 };
        const SequelizeConnectionError = new Sequelize.ConnectionError('Database connection failed');
        
        stores.findOne.mockResolvedValue({ store_id: 1 });
        
        console.log(items); 
        items.deleteItemForStore.mockRejectedValue(SequelizeConnectionError);
    
        const response = await request(app)
            .delete(`/api/stores/items/${itemId}`)
            .set('Authorization', `Bearer ${token}`);
    
        console.log(response.body);
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Database connection failed');
    }); */
    
});

describe('PUT /api/stores/items/:itemId', () => {
    let token;
    let userId = 1;

    beforeEach(() => {
        token = generateToken({ userId: userId });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update an item and return the updated item', async () => {
        const itemId = 1;
        const mockStore = { store_id: 1 };
        const itemData = {
            name: 'Updated Item',
            description: 'Updated Description',
            image_url: 'http://example.com/image.jpg',
            quantity: 10,
            price: 20.00,
        };
        
        stores.findOne.mockResolvedValue(mockStore);
        items.editItemForStore = jest.fn().mockResolvedValue(itemData); 

        const response = await request(app)
            .put(`/api/stores/items/${itemId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(itemData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Item updated successfully');
    });

    /* it('should return 404 if the store is not found', async () => {
        const itemId = 1;
        const itemData = {
            name: 'Updated Item',
            description: 'Updated Description',
        };

        stores.findOne.mockResolvedValue(null);

        const response = await request(app)
            .put(`/api/stores/items/${itemId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(itemData);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', 'Store not found or unauthorized');
    });

    it('should return 500 Internal Server Error when database connection fails', async () => {
        const itemId = 1;
        const SequelizeConnectionError = new Sequelize.ConnectionError('Database connection failed');
        
        stores.findOne.mockResolvedValue({ store_id: 1 });
        items.editItemForStore.mockRejectedValue(SequelizeConnectionError);

        const response = await request(app)
            .put(`/api/stores/items/${itemId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Item',
                description: 'Item Description',
            });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'Database connection failed');
    }); */
});

