import ApiError from "../ApiError.js";
import { Answer_DB, Form_Answer_DB, Form_DB, Question_DB } from "../database/index.js";
import FormDto from "../dtos/FormDto.js";

export default class FormService {
    static async getById(id) {
        const Form = await Form_DB.findOne({ where: { id: id } });
        if (!Form) throw ApiError.badRequest("Такой формы не существует.");
        const questions = await Question_DB.findAll({ where: { form_id: Form.id } });
        Form.questions = questions;
        return Form;
    }

    static async getAll() {
        const forms = await Form_DB.findAll({ order: [['id', 'DESC']], limit: 100 });
        const formDtos = [];
        forms.forEach(form => formDtos.push(new FormDto(form)));
        return formDtos;
    }

    static async removeById(id) {
        Form_DB.destroy({ where: { id: id } });
    }

    static async addNew(author_id, name, description, questions) {
        if (!name || !questions) throw ApiError.badRequest("Вы не заполнили название формы, либо её вопросы.");
        if (questions.length > 15) throw ApiError.badRequest("В одну форму нельзя добавить более 15-ти вопросов.");

        const Form = await Form_DB.create({ name: name, description: description, author_id: author_id, have_picture: false });
        if (!Form) throw ApiError.internal("Форма не была создана.");
        try {
            for (let question in questions) await Question_DB.create({
                name: questions[question].name,
                form_id: Form.id,
                type: parseInt(questions[question].type),
                data: JSON.stringify(questions[question].data)
            });
        } catch (err) {
            Form_DB.destroy({ where: { id: Form.id } });
            throw err;
        }
        return Form;
    }
}