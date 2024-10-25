module.exports = (sequelize, DataTypes) => {
    const items = sequelize.define("orders_items", {
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Please provide the item name."
                }
            }
        },
        quantity: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            validate: {
                notNull: {
                    msg: "Please provide a quantity."
                },
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
        discount_percent: {
            type: DataTypes.INTEGER(4).UNSIGNED,
            validate: {
                min: 1,
                max: 100
            }
        }
    }, {
        createdAt: "date_created",
        updatedAt: "last_updated" 
    });

    return items;
}