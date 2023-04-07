import Sequelize from "sequelize";

export default {
    name: 'forms',
    params: {
        id: {
            autoIncrement: true,
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        author_id: {
            type: Sequelize.BIGINT,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING(128),
            allowNull: false
        },
        description: {
            type: Sequelize.STRING(512),
            allowNull: false
        },
        create_date: {
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