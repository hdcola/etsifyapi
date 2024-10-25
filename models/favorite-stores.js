module.exports = (sequelize, DataTypes) => {
    const stores = sequelize.define("favorite_stores", {

    }, { 
        timestamps: false 
    });

    return stores;
}