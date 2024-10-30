const request = require('supertest');
const express = require('express');
const appSetup = require('../../appSetup');

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
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a payment intent and return clientSecret', async () => {
        const items = [{ amount: 1000 }, { amount: 500 }];

        const response = await request(app)
            .post('/api/payments/create-payment-intent')
            .send({ items });

        expect(response.status).toBe(200);
        expect(response.body.clientSecret).toBe(clientSecret);
        expect(stripe).toHaveBeenCalledTimes(1);
    });
});
