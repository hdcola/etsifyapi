const request = require('supertest');
const express = require('express');
const appSetup = require('../../appSetup');
const { generateToken } = require('../../middlewares/jwt');

const app = express();
appSetup(app);
const clientSecret = 'test_client_secret';
jest.mock('stripe', () => {
    return jest.fn().mockImplementation(() => ({
        paymentIntents: {
            create: jest.fn(() => ({
                client_secret: clientSecret,
            })),
        },
    }));
});

const stripe = require('stripe');

describe('POST /create-payment-intent ', () => {
    let token;
    let userId = 1;

    beforeEach(() => {
        token = generateToken({ userId: userId });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a payment intent and return clientSecret', async () => {
        const items = [{ amount: 1000 }, { amount: 500 }];

        const response = await request(app)
            .post('/api/payments/create-payment-intent')
            .set('Authorization', `Bearer ${token}`)
            .send({ items });

        expect(response.status).toBe(200);
        expect(response.body.clientSecret).toBe(clientSecret);
        expect(stripe).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if items are missing', async () => {
        const response = await request(app)
            .post('/api/payments/create-payment-intent')
            .set('Authorization', `Bearer ${token}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Missing or invalid items');
    });

    it('should return 400 if items contain invalid amounts', async () => {
        const items = [{ amount: 1000 }, { amount: null }];

        const response = await request(app)
            .post('/api/payments/create-payment-intent')
            .set('Authorization', `Bearer ${token}`)
            .send({ items });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            'Invalid items: All items must have an amount'
        );
    });
});
