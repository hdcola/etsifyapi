const request = require('supertest');
const express = require('express');
const router = require('../../routes/users');
const ApiError = require('../../utils/api-error');
const { users } = require('../../models');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/users', router);

jest.mock('../../models');
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mockedToken'),  
}));

describe("POST /users/register", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "testSecretKey";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user and return a success message and token", async () => {
    users.findOne.mockResolvedValue(null);
    users.create.mockResolvedValue({
      id: 1,
      name: "TestUser",
      email: "test@example.com",
    });

    const response = await request(app)
      .post("/users/register")
      .send({
        name: "TestUser",
        email: "test@example.com",
        password: "securePassword",
      });
    console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
    expect(response.body).toHaveProperty('token', 'mockedToken'); 
  });

  it("should fail to register a new user with existing user name", async () => {
    users.findOne.mockResolvedValueOnce({ name: "TestUser" }); 
    users.findOne.mockResolvedValueOnce(null); // user with this email does not exist
    const mockError = ApiError.badRequest("Validation Error", [
      {
        field: "name",
        message: "User name already exists.",
      },
    ]);
    users.create.mockRejectedValue(mockError);
    const response = await request(app)
      .post("/users/register")
      .send({
        name: "TestUser",
        email: "test@example.com",
        password: "securePassword",
      });

    // console.log("response.status => ", response.status);
    // console.log("response body: => ", response.body);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', 'Validation Error');
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toEqual(expect.arrayContaining([{
      field: 'name',
      message: 'User name already exists.'
    }]));
  });

  it("should fail to register a new user with existing email", async () => {
    users.findOne.mockResolvedValueOnce(null); // user with this name does not exist
    users.findOne.mockResolvedValueOnce({ email: "test@example.com" });
    const mockError = ApiError.badRequest("Validation Error", [
      {
        field: "email",
        message: "Email already exists.",
      },
    ]);
    users.create.mockRejectedValue(mockError);
    const response = await request(app)
      .post("/users/register")
      .send({
        name: "TestUser",
        email: "test@example.com",
        password: "securePassword",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", "error");
    expect(response.body).toHaveProperty("message", "Validation Error");
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        {
          field: "email",
          message: "Email already exists.",
        },
      ])
    );
  });
});
