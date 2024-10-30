const request = require('supertest');
const express = require('express');
const appSetup = require('../../appSetup');
const { users } = require('../../models');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');

const app = express();
appSetup(app);

jest.mock('../../models');
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'mockedToken'),
}));

describe('POST /api/users/register', () => {
    beforeAll(() => {
        process.env.JWT_SECRET = 'testSecretKey';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new user and return a success message and token', async () => {
        users.findOne.mockResolvedValue(null);
        users.create.mockResolvedValue({
            id: 1,
            username: 'TestUser',
            full_name: 'TestName TestFamilyName',
            email: 'test@example.com',
        });

        const response = await request(app).post('/api/users/register').send({
            username: 'TestUser',
            full_name: 'TestName TestFamilyName',
            email: 'test@example.com',
            password: 'securePassword',
        });
        // console.log(response.body);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty(
            'message',
            'User registered successfully'
        );
        expect(response.body).toHaveProperty('token', 'mockedToken');
    });

    it('should fail to register a new user with existing email', async () => {
        const SequelizeUniqueConstraintError = new Sequelize.ValidationError();
        SequelizeUniqueConstraintError.name = 'SequelizeUniqueConstraintError';
        SequelizeUniqueConstraintError.errors = [
            {
                message: 'Email is already used.',
                type: 'unique violation',
                path: 'email',
                value: 'test@mail.com',
                origin: 'DB',
                instance: [users],
                validatorKey: 'not_unique',
                validatorName: null,
                validatorArgs: [],
            },
        ];
        users.create.mockRejectedValue(SequelizeUniqueConstraintError);
        const response = await request(app).post('/api/users/register').send({
            username: 'TestUser',
            full_name: 'TestName TestFamilyName',
            email: 'test@example.com',
            password: 'securePassword',
        });

        // console.log(response.body.errors);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'Validation Error');
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                {
                    message: 'Email is already used.',
                    field: 'email',
                },
            ])
        );
    });

    it('it fail to register and return 500 Internal Server Error when database connection fails', async () => {
        const SequelizeConnectionError = new Sequelize.ConnectionError(
            'Database connection failed'
        );
        SequelizeConnectionError.name = 'SequelizeConnectionError';

        users.create.mockRejectedValue(SequelizeConnectionError);
        const response = await request(app).post('/api/users/register').send({
            username: 'TestUser',
            full_name: 'TestName TestFamilyName',
            email: 'test@example.com',
            password: 'securePassword',
        });

        console.log('response.body:', response.body);

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty(
            'message',
            'Internal Server Error'
        );
        expect(response.body).not.toHaveProperty('errors');
    });
});

describe('POST /api/users/login', () => {
    beforeAll(() => {
        process.env.JWT_SECRET = 'testSecretKey';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('it should sucessfully login', async () => {
        const saltRounds = 10;
        users.findOne.mockResolvedValue({
            id: 1,
            username: 'TestUser',
            full_name: 'TestName TestFamilyName',
            email: 'test@example.com',
            password: await bcrypt.hash('securePassword', saltRounds),
        });
        const response = await request(app).post('/api/users/login').send({
            email: 'test@example.com',
            password: 'securePassword',
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Login successful');
        expect(response.body).toHaveProperty('token', 'mockedToken');
    });

    it('it should fail to login with incorrect email or password', async () => {
        users.findOne.mockResolvedValue(null);

        const response = await request(app).post('/api/users/login').send({
            email: 'test@example.com',
            password: 'securePassword',
        });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty(
            'message',
            'Wrong email or password'
        );
    });

    it('it fail to log in and return 500 Internal Server Error when database connection fails', async () => {
        const SequelizeConnectionError = new Sequelize.ConnectionError(
            'Database connection failed'
        );
        SequelizeConnectionError.name = 'SequelizeConnectionError';

        users.findOne.mockRejectedValue(SequelizeConnectionError);
        const response = await request(app).post('/api/users/login').send({
            email: 'test@example.com',
            password: 'securePassword',
        });

        console.log('response.body:', response.body);

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty(
            'message',
            'Internal Server Error'
        );
        expect(response.body).not.toHaveProperty('errors');
    });
});
