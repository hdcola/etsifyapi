const request = require('supertest');
const express = require('express');
const appSetup = require('../../appSetup');
const { orders } = require('../../models');
const { stores } = require('../../models');
const { Sequelize } = require('sequelize');
const { generateToken } = require('../../middlewares/jwt');

const app = express();
appSetup(app);
jest.mock('../../models');

describe('GET /api/orders/', () => {
    let token;
    let userId = 1;
    let mockStore = { store_id: 1 };

    beforeEach(() => {
        token = generateToken({ userId: userId });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and the orders for the logged-in vendor', async () => {
        const mockStore = {
            store_id: 1,
            name: 'Test Store',
            description: 'A description of the test store',
            country_id: 101,
            user_id: userId,
        };
        const mockOrders = [
            {
                order_id: 1,
                status: 'pending',
                total: 100.0,
                full_name: 'Test User',
                store_id: 1,
            },
            {
                order_id: 2,
                status: 'pending',
                total: 100.0,
                full_name: 'Test User',
                store_id: 1,
            },
        ];
        stores.findOne.mockResolvedValue(mockStore);
        orders.findAll.mockResolvedValue(mockOrders);

        const response = await request(app)
            .get('/api/orders')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.orders).toEqual(mockOrders);

        // TODO: add more stuff later: tracking total, payment_method, payment_ref, full_name, street_name, apt_number, city, postal_code, province, phone, date_created, last_updated, store_id, user_id
    });

    it('should return 500 Internal Server Error when database connection fails', async () => {
        const SequelizeConnectionError = new Sequelize.ConnectionError(
            'Database connection failed'
        );
        SequelizeConnectionError.name = 'SequelizeConnectionError';
        orders.findOne.mockRejectedValue(SequelizeConnectionError);

        const response = await request(app)
            .get('/api/orders')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty(
            'message',
            'Database connection failed'
        );
    });
});

describe('PUT /api/orders/:id/status', () => {
    let token;
    let userId = 1;
    const orderId = 1;

    beforeEach(() => {
        token = generateToken({ userId: userId });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and the updated order if the update is successful', async () => {
        const mockOrder = {
            order_id: orderId,
            status: 'pending',
        };

        const updatedOrder = {
            ...mockOrder,
            status: 'completed',
        };

        orders.findOne.mockResolvedValue(mockOrder);
        orders.update.mockResolvedValue([1]);

        const response = await request(app)
            .put(`/api/orders/${orderId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'completed' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.order).toEqual(updatedOrder);
    });

    it('should return 404 if the order does not exist', async () => {
        orders.findOne.mockResolvedValue(null);

        const response = await request(app)
            .put(`/api/orders/${orderId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'completed' });

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Order not found.');
    });

    it('should return 500 Internal Server Error when database connection fails', async () => {
        const errorMessage = 'Database connection error';
        orders.findOne.mockImplementation(() => {
            throw new Error(errorMessage);
        });

        const response = await request(app)
            .put(`/api/orders/${orderId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'completed' });

            console.log('response.body:', response.body);
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty(
            'message',
            'Error updating order status'
        );
    });
});
