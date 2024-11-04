const express = require('express');
const ApiError = require('../utils/api-error');
const router = express.Router();
const { moveCartItemsToOrder } = require('../services/payments-service');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'test_key');

const calculateOrderAmount = (items) => {
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    let total = 0;
    items.forEach((item) => {
        total += item.amount;
    });
    return total;
};

// Create payment intent
router.post('/create-payment-intent', async (req, res, next) => {
    const { items } = req.body;

    // Check if items is provided and is an array
    if (!Array.isArray(items) || items.length === 0) {
        return next(ApiError.badRequest('Missing or invalid items'));
    }

    // Check if each item has a valid amount property
    const invalidItems = items.filter((item) => !item.amount);
    if (invalidItems.length > 0) {
        return next(
            ApiError.badRequest('Invalid items: All items must have an amount')
        );
    }

    try {
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(items),
            currency: 'cad',
        });

        return res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        // Handle errors from Stripe
        return next(ApiError.internal('Failed to create payment intent'));
    }
});

// Move cart items to order
router.post('/checkout', async (req, res, next) => {
    try {
        const order = await moveCartItemsToOrder(
            req.userId,
            req.body.paymentId,
            (isMovingToOrder = true)
        );
        res.status(200).json(order);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
