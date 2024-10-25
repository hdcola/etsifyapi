require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const db = require('./models');
db.sequelize.sync();

const usersRouter = require('./routes/users');

const errorHandler = require('./middlewares/errorHandler');
const ApiError = require('./utils/ApiError');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);

app.use((req, res, next) => {
  const error = ApiError.notFound('Resource not found' + req.originalUrl);
  next(error);
});

app.use(errorHandler);

module.exports = app;
