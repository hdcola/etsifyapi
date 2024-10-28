const { users } = require('../models');
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const ApiError = require('../utils/api-error');
const { generateToken } = require('../utils/jwt');
const yup = require('yup');

const userSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
});

async function createUser({ name, email, password }) {
    try {
        await userSchema.validate(
            { name, email, password },
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

    // check if email already exists
    /* const existingName = await users.findOne({ where: { name } });
    if (existingName) {
        throw ApiError.badRequest('Validation Error', [{
            field: 'name',
            message: 'User name already exists.'
        }]);
    }

    // check if email already exists
    const existingEmail = await users.findOne({ where: { email } });
    if (existingEmail) {
        throw ApiError.badRequest('Validation Error', [{
            field: 'email',
            message: 'Email already exists.'
        }]);
    }*/

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    try {
        const newUser = await users.create({
            name,
            email,
            password: hash,
        });
        const token = generateToken({
            name: newUser.name,
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
