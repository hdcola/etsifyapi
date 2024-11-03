const { stores } = require('../models');
const { Sequelize } = require('sequelize');
const ApiError = require('../utils/api-error');

async function createStore({ countryId, name, description, userId }) {
    try {
        const existingStore = await stores.findOne({ where: { userId } });
        if (existingStore) {
            throw ApiError.badRequest('User already has a store');
        }
        const newStore = await stores.create({
            countryId,
            name,
            description,
            userId,
        });
        return newStore;
    } catch (err) {
        console.log('createStore error: ', err);
        if (err instanceof Sequelize.ValidationError) {
            const errors = err.errors.map((e) => ({
                message: e.message,
                field: e.path,
            }));
            throw ApiError.badRequest('Validation Error', errors);
        }
        if (err instanceof Sequelize.ConnectionError) {
            throw ApiError.internal('Database connection failed');
        }

        throw err;
    }
}

async function getStoreForUser(userId) {
    try {
        const store = await stores.findOne({ where: { user_id: userId } });
        return store;
    } catch (err) {        
        if (err instanceof Sequelize.ConnectionError) {
            throw ApiError.internal('Database connection failed');
        }

        throw err;
    }
}

async function getStoreById(storeId) {
    try {
        const store = await stores.findOne({ where: { store_id: storeId } });
        return store;
    } catch (err) {        
        if (err instanceof Sequelize.ConnectionError) {
            throw ApiError.internal('Database connection failed');
        }

        throw err;
    }
}

// TODO: put edit Store info

module.exports = { createStore, getStoreForUser, getStoreById };
