const express = require('express');
const router = express.Router();
const {
    createStore,
    getStoreForUser,
    getStoreById,
    updateStore,
    createItem,
    getItemsForStore,
    //checkExistingItemName,
    deleteItemForStore,
    editItemForStore,
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


// get items for the store with id
router.get('/:storeId/items', async (req, res, next) => {
    const storeId = req.params.storeId;
    try {
        const items = await getItemsForStore(storeId);
        console.log(items);
        res.status(200).json({
            success: true,
            items,
        });
    } catch (err) {
        console.error('get items for the store with id', err);
        next(err);
    }
});

// create item for the store
router.post('/items', validateToken, async (req, res, next) => {
    const { name, description, image_url, quantity, price } = req.body;
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
        // gives errors
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
            image_url,
            quantity,
            price,
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

// delete item for the store
router.delete('/items/:itemId', validateToken, async (req, res, next) => {
    const { itemId } = req.params;
    const userId = req.userId;

    try {
        const storeFound = await getStoreForUser(userId);
        if (!storeFound) {
            return res.status(404).json({
                success: false,
                message: 'Store not found or unauthorized',
            });
        }

        await deleteItemForStore(itemId, storeFound.store_id);

        res.status(204).json({
            success: true,
            message: 'Item deleted successfully',
        });
    } catch (err) {
        console.error('Error in DELETE /api/stores/items/:item_id:', err);
        next(err);
    }
});

// edit item for the store
router.put('/items/:itemId', validateToken, async (req, res, next) => {
    const { itemId } = req.params;
    const { name, description, image_url, quantity, price } = req.body;
    const userId = req.userId;

    try {
        const storeFound = await getStoreForUser(userId);
        if (!storeFound) {
            return res.status(404).json({
                success: false,
                message: 'Store not found or unauthorized',
            });
        }

        const updatedItem = await editItemForStore(itemId, storeFound.store_id, {
            name,
            description,
            image_url,
            quantity,
            price
        });

        res.status(200).json({
            success: true,
            message: 'Item updated successfully',
            item: updatedItem,
        });
    } catch (err) {
        console.error('Error in  edit item for the store:', err);
        next(err);
    }
});

module.exports = router;
