import ApiError from "../ApiError.js";
import { Form_DB, Question_DB } from "../database/index.js";
import env from "dotenv";
import FormService from "../services/FormService.js";

env.config();

class FormController {
    async add(request, response, next) {
        try {
            const { name, questions } = request.body;

            if (!name || !questions) return next(ApiError.badRequest("Вы не заполнили название формы, либо её вопросы."));
            if (questions.length > 10) return next(ApiError.badRequest("В одну форму нельзя добавить более 10-ти вопросов."));

            Form_DB.create({ name: name, description: description, author_id: request.user.id }).then(result => {
                try {
                    questions.foreach(question => {
                        Question_DB.create({
                            name: question.name,
                            form_id: result.id,
                            type: question.type,
                            data: JSON.stringify(question.data)
                        });
                    });
                } catch (err) {
                    Form_DB.destroy({ where: { id: result.id } });
                    next(ApiError.internal(err));
                }
            });
        } catch (err) { next(ApiError.internal(err.message)); }
    }

    async remove(request, response, next) {
        try {
            const { id } = request.body;
            FormService.removeById(id);
        } catch (err) { next(ApiError.internal(err.message)); }
    }

    async done(request, response, next) {
        try {
            const { form_id, answers } = request.body;
            // TODO: All.
        } catch (err) { next(ApiError.internal(err.message)); }
    }

    async getOne(request, response, next) {
        try {
            const Form = await FormService.getById(request.params.id);
            response.render('form', {
                title: `Форма #${Form.id}`,
                form_name: Form.name,
                form_desc: Form.description,
                form_id: Form.id,
                message: "Проверка работоспособности",
                questions: Form.questions.map(question => {
                    try {
                        return {
                            type: question.type,
                            data: JSON.parse(question.data),
                            name: question.name
                        };
                    } catch (err) { next(ApiError.internal(err.message)); }
                })
            });
        } catch (err) { next(ApiError.internal(err.message)); }
    }

    async getList(request, response, next) {
        try {
            const Forms = await FormService.getAll();
            response.render('forms', {
                title: "Формы",
                forms: result
            });
        } catch (err) { next(ApiError.internal(err.message)); }
    }
}

export default new FormController();