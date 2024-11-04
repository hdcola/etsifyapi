const request = require('supertest');
const express = require('express');
const appSetup = require('../../appSetup');
const { items } = require('../../models');
const { Sequelize } = require('sequelize');
const { generateToken } = require('../../middlewares/jwt');

const app = express();
appSetup(app);
jest.mock('../../models');
