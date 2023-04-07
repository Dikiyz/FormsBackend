import Sequelize from "sequelize";

export default {
    name: 'answers',
    params: {
        id: {
            autoIncrement: true,
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        form_answer_id: {
            type: Sequelize.BIGINT,
            allowNull: false
        },
        question: {
            type: Sequelize.STRING(512),
            allowNull: false,
            default: ""
        },
        type: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        answer: {
            type: Sequelize.STRING(1024),
            allowNull: false
        }
    }, params2: {
        timestamps: false,
        freezeTableName: true,
        indexes: [{ unique: true, fields: ['id'] }]
    }
}