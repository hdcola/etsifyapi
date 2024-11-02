const express = require('express');
const router = express.Router();
const {
    getItems,
    addItem,
    deleteItem,
    updateQuantity,
    getCount,
} = require('../services/carts-service');

// Add items to cart
router.post('/:itemId([0-9]+)', async (req, res, next) => {
    try {
        const cartId = await addItem(
            req.userId,
            req.params.itemId,
            req.body.quantity || 1
        );
        res.status(200).json(cartId);
    } catch (err) {
        next(err);
    }
});

// Get items from cart
router.get('/', async (req, res, next) => {
    try {
        const items = await getItems(req.userId);
        res.status(200).json(items);
    } catch (err) {
        next(err);
    }
});

// Update item quantity in cart
router.patch('/:itemId([0-9]+)', async (req, res, next) => {
    try {
        const quantity = await updateQuantity(
            req.userId,
            req.params.itemId,
            req.body.quantity || 1
        );
        res.status(200).json(quantity);
    } catch (err) {
        next(err);
    }
});

// Remove item from cart
router.delete('/:itemId([0-9]+)', async (req, res, next) => {
    try {
        await deleteItem(req.userId, req.params.itemId);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

// Get item (distinct) count from cart
router.get('/count', async (req, res, next) => {
    try {
        const cart = await getCount(req.userId);
        res.status(200).json(cart);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
