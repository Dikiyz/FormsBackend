import { Sequelize } from "sequelize";
import system from "../system.js";
import env from "dotenv";
env.config();

import model_user from './models/users.js';
import model_form from './models/forms.js';
import model_question from './models/questions.js';
import model_answer from './models/answers.js';
import model_form_answer from './models/form_answers.js';

const connection = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'mariadb',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        logging: (str) => { }
    }
);

const User = connection.define(model_user.name, model_user.params, model_user.params2);
const Form = connection.define(model_form.name, model_form.params, model_form.params2);
const Question = connection.define(model_question.name, model_question.params, model_question.params2);
const Form_Answer = connection.define(model_form_answer.name, model_form_answer.params, model_form_answer.params2);
const Answer = connection.define(model_answer.name, model_answer.params, model_answer.params2);

//#region Associations
User.hasMany(Form, { foreignKey: 'author_id' });
Form.belongsTo(User, { foreignKey: 'author_id' });

User.hasMany(Form_Answer, { foreignKey: 'user_id' });
Form_Answer.belongsTo(User, { foreignKey: 'user_id' });

Form_Answer.hasMany(Answer, { foreignKey: 'form_answer_id' });
Answer.belongsTo(Form_Answer, { foreignKey: 'form_answer_id' });

Form.hasMany(Question, { foreignKey: 'form_id' });
Question.belongsTo(Form, { foreignKey: 'form_id' });

Form.hasMany(Form_Answer, { foreignKey: 'form_id' });
Form_Answer.belongsTo(Form, { foreignKey: 'form_id' });
//#endregion

async function connect() {
    try {
        await connection.authenticate();
        await connection.sync({ force: false });
        system.success('MySQL started successful!');
    } catch (err) {
        system.error('MySQL connection error: ' + err);
        setTimeout(() => process.exit(410), 10 * 1000);
    }
};

connect();

export const User_DB = User;
export const Form_DB = Form;
export const Answer_DB = Answer;
export const Question_DB = Question;
export const Form_Answer_DB = Form_Answer;

export default {};