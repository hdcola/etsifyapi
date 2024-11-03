const { items } = require('../models');
const { Sequelize } = require('sequelize');
const ApiError = require('../utils/api-error');

// get items for the store of the logged vendor
async function getItemsForStore(storeId) {
    try {
        const itemsFound = await items.findAll({
            where: { store_id: storeId },
        });
        return itemsFound;
    } catch (err) {
        if (err instanceof Sequelize.ConnectionError) {
            throw ApiError.internal('Database connection failed');
        }

        throw err;
    }
}

async function createItem({ name, description, store_id }) {
    try {
        const newItem = await items.create({
            name,
            description,
            store_id,
        });
        return newItem;
    } catch (err) {
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

async function checkExistingItemName({ name, store_id }) {
    try {
        const existingItem = await items.findOne({
            where: {
                name: name,
                store_id: store_id,
            },
        });
        return existingItem;
    } catch (err) {
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

module.exports = { getItemsForStore, createItem, checkExistingItemName };
