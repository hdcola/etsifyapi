const { orders } = require('../models');
const { Sequelize } = require('sequelize');
const ApiError = require('../utils/api-error');

// get orders of the store of the logged vendor user
async function getOrdersForStore(store_id) {
    try {
        const responce = await orders.findAll({ where: { store_id: store_id } });
        return responce;
    } catch (err) {        
        if (err instanceof Sequelize.ConnectionError) {
            throw ApiError.internal('Database connection failed');
        }

        throw err;
    }
}


async function updateOrderStatus(orderId, status) {
    try {
        const order = await orders.findOne({ where: { order_id: orderId } });
        if (!order) {
            return null;
        }
        await orders.update({ status }, { where: { order_id: orderId } });

        const updatedOrder = { ...order, status }; 
        return updatedOrder; 
    } catch (err) {
        throw ApiError.internal('Error updating order status');
    }
}

module.exports = { getOrdersForStore, updateOrderStatus };
