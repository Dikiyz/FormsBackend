import Sequelize from "sequelize";

export default {
    name: 'questions',
    params: {
        id: {
            autoIncrement: true,
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        form_id: {
            type: Sequelize.BIGINT,
            allowNull: false
        },
        type: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING(512),
            allowNull: false
        },
        data: {
            type: Sequelize.STRING(1024),
            allowNull: false,
            defaultValue: "{}"
        }
    }, params2: {
        timestamps: false,
        freezeTableName: true,
        indexes: [{ unique: true, fields: ['id'] }]
    }
}