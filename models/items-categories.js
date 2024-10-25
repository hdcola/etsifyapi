module.exports = (sequelize, DataTypes) => {
    const categories = sequelize.define("items_categories", {

    }, { 
        timestamps: false 
    });   

    return categories;
}