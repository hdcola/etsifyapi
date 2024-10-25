module.exports = (sequelize, DataTypes) => {
    const items = sequelize.define("favorite_items", {

    }, { 
        timestamps: false 
    });

    return items;
}