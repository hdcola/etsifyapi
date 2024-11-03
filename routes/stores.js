const express = require('express');
const router = express.Router();
const { createStore, getStoreForUser, getStoreById } = require('../services/stores-service');
const { validateToken} = require('../middlewares/jwt');

router.post('/', validateToken, async (req, res, next) => {
    const { name, description, countryId } = req.body;   
    const userId = req.userId;
    try { 
        const store = await createStore({
            country_id: countryId,
            name,
            description,
            user_id: userId,
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


router.get('/:storeId', async (req, res, next) => {
    try {
        const { storeId } = req.params;
        const store = await getStoreById(storeId);

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

// TODO: edit a store

module.exports = router;
