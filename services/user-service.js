const { users } = require('../models');
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const ApiError = require('../utils/api-error');
const { generateToken } = require('../middlewares/jwt');
const jwt = require('jsonwebtoken');

async function createUser({ username, full_name, email, password }) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    try {
        const newUser = await users.create({
            username,
            full_name,
            email,
            password: hash,
        });
        const token = generateToken({
            username: newUser.username,
            full_name: newUser.full_name,
            email: newUser.email,
            userId: newUser.user_id,
            picture: newUser.picture,
        });
        return token;
    } catch (err) {
        if (err instanceof Sequelize.ValidationError) {
            const errors = err.errors.map((e) => ({
                message: e.message,
                field: e.path,
            }));
            throw ApiError.badRequest('Validation Error', errors);
        } else {
            throw err;
        }
    }
}

async function login({ email, password }) {
    try {
        const user = await users.findOne({ where: { email: email } });
        if (!user) {
            throw ApiError.unauthorized('Wrong email or password');
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw ApiError.unauthorized('Wrong email or password');
        }

        const token = generateToken({
            username: user.username,
            full_name: user.full_name,
            email: user.email,
            userId: user.user_id,
            picture: user.picture,
        });
        return token;
    } catch (err) {
        if (err instanceof Sequelize.ValidationError) {
            const errors = err.errors.map((e) => ({
                message: e.message,
                field: e.path,
            }));
            throw ApiError.unauthorized('Wrong email or password', errors);
        } else {
            throw err;
        }
    }
}

const findUserByEmail = async (email) => {
    return await users.findOne({ where: { email } });
};

async function getUserFromToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (err) {
        throw ApiError.unauthorized('Invalid token');
    }
}

module.exports = { createUser, login, getUserFromToken, findUserByEmail };
