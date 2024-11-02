module.exports = (sequelize, DataTypes) => {
    const items = sequelize.define(
        'carts_items',
        {
            quantity: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    notNull: {
                        msg: 'Please provide a quantity.',
                    },
                    min: {
                        args: [0],
                        msg: 'Quantity cannot be lower than 0.',
                    },
                },
            },
            discount_percent: {
                type: DataTypes.INTEGER(4).UNSIGNED,
                validate: {
                    min: 1,
                    max: 100,
                },
            },
        },
        {
            createdAt: 'date_created',
            updatedAt: 'last_updated',
        }
    );

    items.associate = (models) => {
        items.belongsTo(models.carts, { foreignKey: 'cart_id' });
        items.belongsTo(models.items, { foreignKey: 'item_id' });
    };

    return items;
};
