import Sequelize from "sequelize";

export default {
    name: 'form_answers',
    params: {
        id: {
            autoIncrement: true,
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: Sequelize.BIGINT,
            allowNull: false
        },
        form_id: {
            type: Sequelize.BIGINT,
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