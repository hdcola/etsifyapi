require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cros = require('cors');

const db = require('./models');
db.sequelize.sync();

const usersRouter = require('./routes/users');
const paymentsRouter = require('./routes/payments');

const errorHandler = require('./middlewares/error-handler');
const ApiError = require('./utils/api-error');

const app = express();

app.use(cros());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/', paymentsRouter);

app.use((req, res, next) => {
  const error = ApiError.notFound('Resource not found' + req.originalUrl);
  next(error);
});

app.use(errorHandler);

module.exports = app;
