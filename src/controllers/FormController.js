import ApiError from "../ApiError.js";
import { Form_DB, Question_DB } from "../database/index.js";
import env from "dotenv";

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

            Form_DB.destroy({ where: { id: id } });
        } catch (err) { next(ApiError.internal(err.message)); }
    }

    async done(request, response, next) {
        try {
            const { form_id, answers } = request.body;

        } catch (err) { next(ApiError.internal(err.message)); }
    }

    async getOne(request, response, next) {
        try {
            Form_DB.findOne({ where: { id: request.params.id } }).then(async result => {
                if (!result) return next(ApiError.badRequest("Такой формы не существует."));
                const questions = await Question_DB.findAll({ where: { form_id: result.id } });
                response.render('form', {
                    title: `Форма #${result.id}`,
                    form_name: result.name,
                    form_desc: result.description,
                    form_id: result.id,
                    message: "Проверка работоспособности",
                    questions: questions.map(question => {
                        try {
                            return {
                                type: question.type,
                                data: JSON.parse(question.data),
                                name: question.name
                            };
                        } catch (err) { next(ApiError.internal(err.message)); }
                    })
                });
            }, err => { next(ApiError.internal(err)) });
        } catch (err) { next(ApiError.internal(err.message)); }
    }

    async getList(request, response, next) {
        try {
            Form_DB.findAll({ order: [['id', 'DESC']], limit: 10 }).then(result => {
                if (result.length === 0) return next(ApiError.internal("Нет активных форм для заполнения."));

                response.render('forms', {
                    title: "Формы",
                    forms: result
                });
            }, err => next(ApiError.internal("Ошибка обращения к базе данных. Свяжитесь с администратором.")));
        } catch (err) { next(ApiError.internal(err.message)); }
    }
}

export default new FormController();