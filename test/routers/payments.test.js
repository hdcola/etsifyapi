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
const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJmdWxsX25hbWUiOiJ0ZXN0RnVsbF9uYW1lIiwiZW1haWwiOiJ0ZXN0QG1haWwuY29tIiwiaWF0IjoxNzMwNDcyNDQ1LCJleHAiOjE3MzkxMTI0NDV9.mg-9z1Sd0XMOwRLfUDYcSgaviwq4Eq5iZCCsJhRNvoU';

describe('POST /create-payment-intent ', () => {
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
