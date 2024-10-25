module.exports = (sequelize, DataTypes) => {
    const categories = sequelize.define("categories", {
        category_id: {
            type: DataTypes.BIGINT(20).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            // Should category name be unique?
            validate: {
                notNull: {
                    msg: "Please provide a category name."
                }
            }
        }
    }, { 
        timestamps: false 
    });
    
    categories.associate = (models) => {
        categories.belongsTo(models.categories, {
            foreignKey: "subcategory_id",
            as: "subcategory"
        });

        categories.belongsToMany(models.items, {
            foreignKey: "category_id",
            through: "items_categories"
        });
    }

    return categories;
}