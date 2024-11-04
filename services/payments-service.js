const { sequelizeTryCatch } = require('../utils/sequelize-helper');
const { users, orders, items, sequelize } = require('../models');
const ApiError = require('../utils/api-error');

async function moveCartItemsToOrder(userId, paymentId, isMovingToOrder = true) {
    return sequelizeTryCatch(async () => {
        // Start a transaction
        const transaction = await sequelize.transaction();

        try {
            // Get the user
            const user = await users.findByPk(userId, { transaction });
            if (!user) {
                throw ApiError.badRequest(`User ${userId} doesn't exist.`);
            }

            // Get the cart
            const cart = await user.getCart({ transaction });
            if (!cart) {
                throw ApiError.badRequest(
                    `User ${userId} doesn't have a cart.`
                );
            }

            // Get all cart items
            const cartItems = await cart.getItems({ transaction });

            // Create a new order
            const newOrder = await orders.create(
                {
                    user_id: userId,
                    payment_ref: paymentId,
                    payment_method: 'Stripe',
                    full_name: user.full_name,
                    status: 'Pending',
                    total: cartItems.reduce(
                        (sum, item) =>
                            sum + item.price * item.carts_items.quantity,
                        0
                    ),
                },
                { transaction }
            );

            // Add items to the order
            for (const item of cartItems) {
                await newOrder.addItem(item, {
                    through: {
                        name: item.name, // Ensure the item name is provided
                        quantity: item.carts_items.quantity,
                        price: item.price, // Ensure the item price is provided
                        discount_percent: item.carts_items.discount_percent,
                    },
                    transaction,
                });
            }

            // Clear the cart and delete cart items if isMovingToOrder is true
            if (isMovingToOrder) {
                await cart.setItems([], { transaction });
                await sequelize.models.carts_items.destroy({
                    where: { cart_id: cart.cart_id },
                    transaction,
                });
            }

            // Commit the transaction
            await transaction.commit();

            return newOrder;
        } catch (error) {
            // Rollback the transaction in case of error
            await transaction.rollback();
            console.error(error);
            throw ApiError.internal('Failed to move cart items to order');
        }
    });
}

module.exports = { moveCartItemsToOrder };
