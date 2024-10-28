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

async function createUser({ username, full_name, email, password }) {
    try {
        await userSchema.validate(
            { username, full_name, email, password },
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
            full_name,
            email,
            password: hash,
        });
        const token = generateToken({
            username: newUser.username, 
            full_name: newUser.full_name, 
            email: newUser.email,
            id: newUser.id,
        });
        // console.log('token: ', token);
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
    try{
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
            id: user.id,
        });
        console.log('token: ', token);
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

module.exports = { createUser, login };
