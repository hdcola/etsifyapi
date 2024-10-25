module.exports = (sequelize, DataTypes) => {
    const stores = sequelize.define("stores", {
        store_id: {
            type: DataTypes.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: {
                args: true,
                msg: "Store name already in use."
            },
            validate: {
                notNull: {
                    msg: "Please provide a store name."
                }
            }
        },
        description: {
            type: DataTypes.TEXT
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
        logo_url: {
            type: DataTypes.STRING(360),
            validate: {
                isUrl: {
                    args: true,
                    msg: "Please provide a valid url."
                }
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

    stores.associate = (models) => {
        stores.belongsTo(models.users, {
            foreignKey: {
                name: "user_id",
                allowNull: false,
                unique: {
                    args: true,
                    msg: "User already has a store."
                },
                validate: {
                    notNull: {
                        msg: "Please enter a user associated with the store."
                    }
                }
            },
            as: "user"
        });
        
        stores.belongsTo(models.countries, {
            foreignKey: {
                name: "country_id",
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Please enter a country associated with the store."
                    }
                }
            },
            as: "country"
        });

        stores.hasMany(models.orders, {
            foreignKey: "store_id",
            as: "orders"
        });

        stores.hasMany(models.items, {
            foreignKey: "store_id",
            as: "items"
        });
        
        stores.belongsToMany(models.users, {
            foreignKey: "store_id",
            through: "favorite_stores"
        });
    }

    return stores;
}