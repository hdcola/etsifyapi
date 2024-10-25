module.exports = (sequelize, DataTypes) => {
    const addresses = sequelize.define("addresses", {
        address_id: {
            type: DataTypes.BIGINT(20).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        is_default: {
            type: DataTypes.TINYINT(1),
            allowNull: false,
            defaultValue: 0
        },
        full_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Please provide a full name associated with the shipping."
                }
            }
        },
        street_name: {
            type: DataTypes.STRING(255)
        },
        apt_number: {
            type: DataTypes.STRING(50)
        },
        city: {
            type: DataTypes.STRING(100)
        },
        postal_code: {
            type: DataTypes.STRING(20)
        },
        province: {
            type: DataTypes.STRING(100)
        },
        phone: {
            type: DataTypes.STRING(20)
        }
    }, {
        createdAt: "date_created",
        updatedAt: "last_updated" 
    });

    addresses.associate = (models) => {
        addresses.belongsTo(models.users, {
            foreignKey: "user_id",
            as: "user"
        });

        addresses.belongsTo(models.countries, {
            foreignKey: {
                name: "country_id",
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Please provide a country."
                    }
                }
            },
            as: "country"
        });
    }

    return addresses;
}