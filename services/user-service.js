const { users } = require('../models');
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const ApiError = require('../utils/api-error');
const { generateToken } = require('../middlewares/jwt');
const jwt = require('jsonwebtoken');
const { sequelizeTryCatch } = require('../utils/sequelize-helper');

async function createUser({ username, full_name, email, password, picture }) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    try {
        const newUser = await users.create({
            username,
            full_name,
            email,
            password: hash,
            picture,
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

const getUserById = async (userId) => {
    return await users.findByPk(userId);
};

const changeUserSettings = async ({
    userId,
    full_name,
    username,
    password,
    picture,
}) => {
    return sequelizeTryCatch(async () => {
        const user = await users.findByPk(userId);
        if (!user) {
            throw ApiError.notFound('User not found');
        }

        if (full_name) {
            user.full_name = full_name;
        }

        if (username) {
            user.username = username;
        }

        if (password) {
            const saltRounds = 10;
            user.password = await bcrypt.hash(password, saltRounds);
        }

        if (picture) {
            user.picture = picture;
        }

        await user.save();
        const token = generateToken({
            username: user.username,
            full_name: user.full_name,
            email: user.email,
            userId: user.user_id,
            picture: user.picture,
        });
        return token;
    });
};

module.exports = {
    createUser,
    login,
    getUserFromToken,
    findUserByEmail,
    getUserById,
    changeUserSettings,
};
