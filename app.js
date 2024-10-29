require('dotenv').config();
const express = require('express');

const db = require('./models');
db.sequelize.sync();

const appSetup = require('./appSetup');
const app = express();

appSetup(app);

module.exports = app;
