import ApiError from "../ApiError.js";
import { Form_DB, Question_DB } from "../database/index.js";

export default class FormService {
    static async getById(id) {
        const Form = await Form_DB.findOne({ where: { id: id } });
        if (!Form) throw ApiError.badRequest("Такой формы не существует.");
        const questions = await Question_DB.findAll({ where: { form_id: Form.id } });
        Form.questions = questions;
        return Form;
    }

    static async getAll() {
        return await Form_DB.findAll({ order: [['id', 'DESC']], limit: 10 });
    }

    static async removeById(id) {
        Form_DB.destroy({ where: { id: id } });
    }

    static async addNew(author_id, name, questions) {

    }

    static async addAnswersToForm(user_id, form_id, answers) {

    }
}