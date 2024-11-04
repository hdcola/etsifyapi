const express = require('express');
const router = express.Router();
const {
    createStore,
    getStoreForUser,
    getStoreById,
    updateStore,
    createItem,
    getItemsForStore,
    checkExistingItemName,
} = require('../services/stores-service');
const { validateToken } = require('../middlewares/jwt');

router.post('/', validateToken, async (req, res, next) => {
    const { name, description, country_id } = req.body;
    const user_id = req.userId;
    try {
        const store = await createStore({
            country_id,
            name,
            description,
            user_id,
        });
        res.status(201).json({
            success: true,
            message: 'Store created successfully',
            store,
        });
    } catch (err) {
        next(err);
    }
});

/* get store of the logged user */
router.get('/', validateToken, async (req, res, next) => {
    const userId = req.userId;
    try {
        const store = await getStoreForUser(userId);
        res.status(200).json({
            success: true,
            store,
        });
    } catch (err) {
        next(err);
    }
});

router.put('/', validateToken, async (req, res, next) => {
    const { name, description, logo_url } = req.body;
    const user_id = req.userId;

    try {
        const store = await getStoreForUser(user_id);
        if (!store) {
            return res.status(404).json({
                success: false,
                message: 'Store not found or unauthorized',
            });
        }

        const updatedStore = await updateStore(store, {
            name,
            description,
            logo_url,
        });

        res.status(200).json({
            success: true,
            message: 'Store updated successfully',
            store: updatedStore,
        });
    } catch (err) {
        console.error('Error in PUT /api/stores:', err);
        next(err);
    }
});

// get items for the store of the logged vendor
router.get('/items', validateToken, async (req, res, next) => {
    const userId = req.userId;
    console.log('hello??');
    try {
        const storeFound = await getStoreForUser(userId);
        if (!storeFound) {
            return res.status(404).json({
                success: false,
                message: 'Store not found or unauthorized',
            });
        }
        const storeId = storeFound.store_id;
        const items = await getItemsForStore(storeId);
        res.status(200).json({
            success: true,
            items,
        });
    } catch (err) {
        console.error('get items for the store of the logged vendor', err);
        next(err);
    }
});

// create item
router.post('/items', validateToken, async (req, res, next) => {
    const { name, description } = req.body;
    const userId = req.userId;
    try {
        const storeFound = await getStoreForUser(userId);
        if (!storeFound) {
            return res.status(404).json({
                success: false,
                message: 'Store not found or unauthorized',
            });
        }
        const store_id = storeFound.store_id;
        /*
        // check if an item with the same name already exists in the store
        const existingItem = await checkExistingItemName(name, store_id);

        if (existingItem) {
            return res.status(409).json({
                success: false,
                message:
                    'An item with the same name already exists in this store',
            });
        }*/
        // create the new item if no existing item found
        const item = await createItem({
            name,
            description,
            store_id,
        });
        res.status(201).json({
            success: true,
            message: 'Item created successfully',
            item,
        });
    } catch (err) {
        console.error('create item:', err);
        next(err);
    }
});

router.get('/:store_id', async (req, res, next) => {
    try {
        const { store_id } = req.params;
        const store = await getStoreById(store_id);

        if (!store) {
            return res.status(404).json({
                success: false,
                message: 'Store not found',
            });
        }

        res.status(200).json({
            success: true,
            store,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
