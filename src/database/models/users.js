import Sequelize from "sequelize";

export default {
    name: 'users',
    params: {
        id: {
            autoIncrement: true,
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        login: {
            type: Sequelize.STRING(32),
            allowNull: false
        },
        password: {
            type: Sequelize.STRING(512),
            allowNull: false
        },
        email: {
            type: Sequelize.STRING(512),
            allowNull: false
        },
        name: {
            type: Sequelize.STRING(64),
            allowNull: false
        },
        isAdmin: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        reg_date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.Sequelize.fn('current_timestamp')
        }
    }, params2: {
        timestamps: false,
        freezeTableName: true,
        indexes: [{ unique: true, fields: ['id'] }]
    }
}