module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define("users", {
        user_id: {
            type: DataTypes.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Name is required."
                }
            }
        },
        email: {
            type: DataTypes.STRING(360),
            allowNull: false,
            unique: {
                args: true,
                msg: "Email is already used."
            },
            validate: {
                notNull: {
                    msg: "Please provide an email."
                },
                isEmail: {
                    msg: "Please provide a valid email."
                }
            }
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Please provide a password."
                }
            }
        }
    }, {
        createdAt: "date_created",
        updatedAt: "last_updated"
    });

    users.associate = (models) => {
        users.hasOne(models.stores, {
            foreignKey: "user_id",
            as: "store" // confirm
        });

        users.hasOne(models.carts, {
            foreignKey: "user_id",
            as: "cart" // confirm
        });
        
        users.hasMany(models.orders, {
            foreignKey: "user_id",
            as: "orders"
        });

        users.hasMany(models.addresses, {
            foreignKey: "user_id",
            as: "addresses"
        });

        users.hasMany(models.reviews, {
            foreignKey: "user_id",
            as: "reviews"
        });

        users.belongsToMany(models.stores, {
            foreignKey: "user_id",
            through: "favorite_stores" 
        });

        users.belongsToMany(models.items, {
            foreignKey: "user_id",
            through: "favorite_items"
        });
    }

    return users;
}