module.exports = (sequelize, DataTypes) => {
    const countries = sequelize.define("countries", {
        country_id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Please enter a country name."
                }
            }
        }
    }, { 
        timestamps: false 
    });

    return countries;
}