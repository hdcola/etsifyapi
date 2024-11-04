const { stores, items } = require('../models');
const { Sequelize } = require('sequelize');
const ApiError = require('../utils/api-error');

async function createStore({ country_id, name, description, user_id }) {
    try {
        const existingStore = await stores.findOne({
            where: { user_id: user_id },
        });
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

// get items for the store with storeId
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

async function createItem({
    name,
    description,
    store_id,
    image_url,
    quantity,
    price,
}) {
    try {
        const newItem = await items.create({
            name,
            description,
            store_id,
            image_url,
            quantity,
            price,
        });
        return newItem;
    } catch (err) {
        console.log('createItem error: ', err);
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

async function deleteItemForStore(itemId, storeId) {
    try {
        const item = await items.findOne({
            where: { item_id: itemId, store_id: storeId },
        });
        if (!item) {
            throw ApiError.notFound('Item not found in this store');
        }
        await item.destroy();
    } catch (err) {
        if (err instanceof Sequelize.ConnectionError) {
            throw ApiError.internal('Database connection failed');
        }
        throw err;
    }
}

async function editItemForStore(
    itemId,
    storeId,
    { name, description, image_url, quantity, price }
) {
    try {
        const item = await items.findOne({
            where: { item_id: itemId, store_id: storeId },
        });
        if (!item) {
            throw ApiError.notFound('Item not found in this store');
        }

        item.name = name || item.name;
        item.description = description || item.description;
        item.image_url = image_url || item.image_url;
        item.quantity = quantity !== undefined ? quantity : item.quantity; 
        item.price = price !== undefined ? price : item.price;

        await item.save();
        return item;
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

module.exports = {
    createStore,
    getStoreForUser,
    getStoreById,
    updateStore,
    getItemsForStore,
    createItem,
    checkExistingItemName,
    deleteItemForStore,
    editItemForStore,
};
