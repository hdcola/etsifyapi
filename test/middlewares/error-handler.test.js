const request = require('supertest');
const express = require('express');
const ApiError = require('../../utils/api-error');
const errorHandler = require('../../middlewares/error-handler');

describe('Error Handler Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
  });

  it('should handle ApiError with errors', async () => {
    app.use((req, res, next) => {
      next(
        new ApiError('Test error', 400, [
          { field: 'name', message: 'Name is required' },
        ])
      );
    });
    app.use(errorHandler);

    const response = await request(app).get('/');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Test error',
      errors: [{ field: 'name', message: 'Name is required' }],
    });
  });

  it('should handle ApiError without errors', async () => {
    app.use((req, res, next) => {
      next(new ApiError('Test error without details', 400));
    });
    app.use(errorHandler);

    const response = await request(app).get('/');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Test error without details',
    });
  });

  it('should handle generic errors', async () => {
    app.use((req, res, next) => {
      next(new Error('Generic error'));
    });
    app.use(errorHandler);

    const response = await request(app).get('/');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error',
    });
  });
});
