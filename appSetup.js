const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const usersRouter = require('./routes/users');
const paymentsRouter = require('./routes/payments');

const errorHandler = require('./middlewares/error-handler');
const ApiError = require('./utils/api-error');

module.exports = (app) => {
    app.use(cors());

    // middlewares configuration
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    // routes configuration
    app.use('/api/users', usersRouter);
    app.use('/api/payments', paymentsRouter);

    // 404 error handler
    app.use((req, res, next) => {
        const error = ApiError.notFound('Resource not found' + req.originalUrl);
        next(error);
    });

    // global error handler
    app.use(errorHandler);
};