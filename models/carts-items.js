module.exports = (sequelize, DataTypes) => {
    const items = sequelize.define("carts_items", {
        quantity: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: 0,
            validate: {
                notNull: {
                    msg: "Please provide a quantity."
                },
                min: 0
            }
        },
        discount_percent: {
            type: DataTypes.INTEGER(4),
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