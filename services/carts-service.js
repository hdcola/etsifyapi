const { users, items } = require('../models');
const { sequelizeTryCatch } = require('../utils/sequelize-helper');

async function addItem(userId, itemId, quantity) {
    return sequelizeTryCatch(async () => {
        // Get the user
        const user = await users.findByPk(userId);
        if (!user) {
            throw new Error(`User ${userId} doesn't exist.`);
        }

        // Get the item
        const item = await items.findByPk(itemId);
        if (!item) {
            throw new Error(`Item ${itemId} doesn't exist.`);
        }

        // Check if a cart exists
        let cart = await user.getCart();
        if (!cart) {
            cart = await user.createCart();
        }

        // Add quantity
        await cart.addItem(item, { through: { quantity: quantity } });

        // Return the related cart id
        return cart.cart_id;
    });
}

async function getItems(userId) {
    return sequelizeTryCatch(async () => {
        // Get the user
        const user = await users.findByPk(userId);
        if (!user) {
            throw new Error(`User ${userId} doesn't exist.`);
        }

        // Get the cart
        const cart = await user.getCart();
        if (!cart) {
            throw new Error(`User ${userId} doesn't have a cart.`);
        }

        // Get all cart items
        return await cart.getItems({
            attributes: { exclude: ['store_id'] },
            joinTableAttributes: ['quantity', 'discount_percent'],
            include: [
                {
                    association: 'store',
                    attributes: {
                        exclude: [
                            'last_updated',
                            'date_created',
                            'description',
                            'image_url',
                            'user_id',
                            'country_id',
                        ],
                    },
                    include: [
                        {
                            association: 'country',
                        },
                    ],
                },
            ],
        });
    });
}

async function updateQuantity(userId, itemId, quantity) {
    return sequelizeTryCatch(async () => {
        // Get the user
        const user = await users.findByPk(userId);
        if (!user) {
            throw new Error(`User ${userId} doesn't exist.`);
        }

        // Check if a cart exists
        const cart = await user.getCart();
        if (!cart) {
            throw new Error(`User ${userId} doesn't have a cart.`);
        }

        // Get the item
        const item = await items.findByPk(itemId);
        if (!item) {
            throw new Error(`Item ${itemId} doesn't exist.`);
        }

        // Check if the item is in the cart
        const isInCart = await cart.hasItem(item);
        if (!isInCart) {
            throw new Error(`Item ${itemId} doesn't exist in cart.`);
        }

        // Update quantity
        const maxQuantity = Math.min(item.quantity, quantity);
        await cart.addItem(item, {
            through: { quantity: maxQuantity },
        });

        return maxQuantity;
    });
}

async function deleteItem(userId, itemId) {
    return sequelizeTryCatch(async () => {
        // Get the user
        const user = await users.findByPk(userId);
        if (!user) {
            throw new Error(`User ${userId} doesn't exist.`);
        }

        // Get the cart
        const cart = await user.getCart();
        if (!cart) {
            throw new Error(`User ${userId} doesn't have a cart.`);
        }

        // Remove the entry
        await cart.removeItem(itemId);
    });
}

async function getCount(userId) {
    return sequelizeTryCatch(async () => {
        // Get the user
        const user = await users.findByPk(userId);
        if (!user) {
            throw new Error(`User ${userId} doesn't exist.`);
        }

        // Get the cart
        const cart = await user.getCart();
        if (!cart) {
            return 0;
        }

        return await cart.countItems();
    });
}

module.exports = { getItems, addItem, deleteItem, updateQuantity, getCount };
