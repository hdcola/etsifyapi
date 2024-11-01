const express = require('express');
const router = express.Router();
const { createStore, getStoreForUser, getStoreById } = require('../services/stores-service');
const { validateToken} = require('../middlewares/jwt');

router.post('/', validateToken, async (req, res, next) => {
    const { name, description, country_id } = req.body;   
    const user_id = req.userId;
    console.log("user_id:", user_id);
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
        console.error(err);
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
