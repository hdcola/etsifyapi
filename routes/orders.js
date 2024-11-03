const express = require('express');
const router = express.Router();
const { getOrdersForStore, updateOrderStatus } = require('../services/orders-service');const { getStoreForUser } = require('../services/stores-service');
const { validateToken} = require('../middlewares/jwt');

// get orders of the store of the logged vendor user
router.get('/', async (req, res, next) => { 
   const userId = req.userId;
    try {
         // check if the user has a store
        const store = await getStoreForUser(userId);
         if (!store) {
             return res.status(404).json({
                 success: false,
                 message: 'Store not found for this user.',
             });
         }
         
         // fetch orders for the logged user's store
         const orders = await getOrdersForStore(store.store_id);
         res.status(200).json({
             success: true,
             orders,
         });
    } catch (err) {
        next(err);
    }
});

router.put('/:orderId/status', async (req, res, next) => {
    const orderId = req.params.orderId;
    const { status } = req.body;

    try {
        const updatedOrder = await updateOrderStatus(orderId, status);
        if (updatedOrder) {
            return res.status(200).json({
                success: true,
                order: updatedOrder,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Order not found.',
            });
        }
    } catch (err) {
        next(err);
    }
});

// TODO: get orders logged user (not a vendor)

module.exports = router;
