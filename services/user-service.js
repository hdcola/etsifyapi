const { users } = require('../models');
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const ApiError = require('../utils/api-error');
const { generateToken } = require('../utils/jwt');
const yup = require('yup');

const userSchema = yup.object().shape({
    username: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
});

async function createUser({ username, email, password }) {
    try {
        await userSchema.validate(
            { username, email, password },
            { abortEarly: false }
        );
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

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    try {
        const newUser = await users.create({
            username,
            email,
            password: hash,
        });
        const token = generateToken({
            username: newUser.username, 
            email: newUser.email,
            id: newUser.id,
        });
        console.log('token: ', token);
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

module.exports = { createUser };
