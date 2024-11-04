module.exports = (sequelize, DataTypes) => {
    const orders = sequelize.define(
        'orders',
        {
            order_id: {
                type: DataTypes.BIGINT(20).UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            status: {
                type: DataTypes.STRING(50),
                defaultValue: 'Pending',
            },
            tracking: {
                type: DataTypes.STRING(255),
            },
            total: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.0,
                validate: {
                    notNull: {
                        msg: 'Please provide the order total.',
                    },
                    isDecimal: {
                        args: true,
                        msg: 'Please enter a currency value.',
                    },
                    min: 0.0,
                },
            },
            payment_method: {
                type: DataTypes.STRING(50),
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Please provide a payment method.',
                    },
                },
            },
            payment_ref: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Please provide the payment reference.',
                    },
                },
            },
            full_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Please provide a full name associated with the shipping.',
                    },
                },
            },
            street_name: {
                type: DataTypes.STRING(255),
            },
            apt_number: {
                type: DataTypes.STRING(50),
            },
            city: {
                type: DataTypes.STRING(100),
            },
            postal_code: {
                type: DataTypes.STRING(20),
            },
            province: {
                type: DataTypes.STRING(100),
            },
            phone: {
                type: DataTypes.STRING(20),
            },
        },
        {
            createdAt: 'date_created',
            updatedAt: 'last_updated',
        }
    );

    orders.associate = (models) => {
        orders.belongsTo(models.stores, {
            foreignKey: 'store_id',
            as: 'store',
        });

        orders.belongsTo(models.users, {
            foreignKey: 'user_id',
            as: 'user',
        });

        orders.belongsToMany(models.items, {
            foreignKey: 'order_id',
            through: 'orders_items',
        });
    };

    return orders;
};
