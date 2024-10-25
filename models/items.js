module.exports = (sequelize, DataTypes) => {
    const items = sequelize.define("items", {
        item_id: {
            type: DataTypes.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Please provide an item name."
                }
            }
        },
        description: {
            type: DataTypes.TEXT
        },
        quantity: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        price: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            defaultValue: 0.00,
            validate: {
                notNull: {
                    msg: "Please provide the item price."
                },
                isDecimal: {
                    args: true,
                    msg: "Please enter a currency value."
                },
                min: 0.00
            }
        },
        rating: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 5
            }
        },
        discount_percent: {
            type: DataTypes.INTEGER(4),
            validate: {
                min: 1,
                max: 100
            }
        },
        image_url: {
            type: DataTypes.STRING(360),
            validate: {
                isUrl: {
                    args: true,
                    msg: "Please provide a valid url."
                }
            }
        }
    }, {
        createdAt: "date_created",
        updatedAt: "last_updated" 
    });

    items.associate = (models) => {
        items.belongsTo(models.stores, {
            foreignKey: "store_id",
            as: "store"
        });

        items.hasMany(models.reviews, {
            foreignKey: "item_id",
            as: "reviews"
        });

        items.belongsToMany(models.users, {
            foreignKey: "item_id",
            through: "favorite_items"
        });

        items.belongsToMany(models.categories, {
            foreignKey: "item_id",
            through: "items_categories"
        });

        items.belongsToMany(models.carts, {
            foreignKey: "item_id",
            through: "carts_items"
        });

        items.belongsToMany(models.orders, {
            foreignKey: "item_id",
            through: "orders_items"
        });
    }

    return items;
}