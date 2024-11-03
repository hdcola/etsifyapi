const { stores } = require('../models');
const { Sequelize } = require('sequelize');
const ApiError = require('../utils/api-error');

async function createStore({ country_id, name, description, user_id }) {
    try {
        const existingStore = await stores.findOne({ where: { user_id: user_id } });
        if (existingStore) {
            throw ApiError.badRequest('User already has a store');
        }
        const newStore = await stores.create({
            country_id,
            name,
            description,
            user_id,
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

async function getStoreById(store_id) {
    try {
        const store = await stores.findOne({ where: { store_id: store_id } });
        return store;
    } catch (err) {        
        if (err instanceof Sequelize.ConnectionError) {
            throw ApiError.internal('Database connection failed');
        }

        throw err;
    }
}
async function updateStore(store, { name, description, logo_url }) {
    try {
        store.name = name || store.name;
        store.description = description || store.description;
        store.logo_url = logo_url || null;

        await store.save();
        return store;
    } catch (err) {
        console.log('updateStore error:', err);
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


module.exports = { createStore, getStoreForUser, getStoreById, updateStore };
