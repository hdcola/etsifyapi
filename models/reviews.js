module.exports = (sequelize, DataTypes) => {
    const reviews = sequelize.define("reviews", {
        review_id: {
            type: DataTypes.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        description: {
            type: DataTypes.TEXT
        },
        rating: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Please provide a rating from 0-5."
                },
                min: 0,
                max: 5
            }
        }
    }, {
        createdAt: "date_created",
        updatedAt: "last_updated" 
    });

    reviews.associate = (models) => {
        reviews.belongsTo(models.users, {
            foreignKey: "user_id",
            as: "user"
        });

        reviews.belongsTo(models.items, {
            foreignKey: "item_id",
            as: "item"
        });
    }

    return reviews;
}