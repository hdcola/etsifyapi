module.exports = (sequelize, DataTypes) => {
    const carts = sequelize.define("carts", {
        cart_id: {
            type: DataTypes.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        }
    }, {
        createdAt: "date_created",
        updatedAt: "last_updated" 
    });

    carts.associate = (models) => {
        carts.belongsTo(models.users, {
            foreignKey: "user_id",
            as: "user"
        });

        carts.belongsToMany(models.items, {
            foreignKey: "cart_id",
            through: "carts_items"
        });
    }

    return carts;
}