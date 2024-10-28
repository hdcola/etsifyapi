const request = require('supertest');
const express = require('express');
const router = require('../../routes/users');
const ApiError = require('../../utils/api-error');
const { users } = require('../../models');
const { Sequelize } = require('sequelize');
const errorHandler = require('../../middlewares/error-handler');

const app = express();
app.use(express.json());
app.use('/api/users', router);
app.use(errorHandler);

jest.mock('../../models');
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'mockedToken'),
}));

describe('POST /users/register', () => {
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
            name: 'TestUser',
            email: 'test@example.com',
        });

        const response = await request(app).post('/api/users/register').send({
            name: 'TestUser',
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
            name: 'TestUser',
            email: 'test@example.com',
            password: 'securePassword',
        });

        console.log(response.body.errors);
        // console.log("response.status => ", response.status);
        // console.log("response body: => ", response.body);
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
});
