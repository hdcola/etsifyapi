const express = require('express');
const router = express.Router();
const {
    getItemsForStore,
    createItem,
    checkExistingItemName,
} = require('../services/items-service');
const { getStoreForUser } = require('../services/stores-service');
const { validateToken } = require('../middlewares/jwt');

// get items for the store of the logged vendor
router.get('/', validateToken, async (req, res, next) => {
    const userId = req.userId;
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
        next(err);
    }
});

// create item
router.post('/add', validateToken, async (req, res, next) => {
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
        next(err);
    }
});

module.exports = router;
