import ApiError from "../ApiError.js";
import env from "dotenv";
import FormService from "../services/FormService.js";

env.config();

class FormController {
    async addPage(request, response, next) {
        try {
            response.render('addPage', { title: "Создание формы" });
        } catch (err) { next(ApiError.internal(err.message)); }
    }

    async add(request, response, next) {
        try {
            const { name, description, questions } = request.body;
            const Form = await FormService.addNew(request.user.id, name, description, questions);
            response.status(200).json({ message: `Форма успешно создана! Её id: ${Form.id}` });
        } catch (err) { next(ApiError.internal(err.message)); }
    }

    async remove(request, response, next) {
        try {
            const { id } = request.params;
            FormService.removeById(id);
            response.status(200).json({ message: "Форма успешно удалена!" });
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
                isAdmin: request.user.isAdmin,
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
            const formsArray = [];
            let formsLine = [];
            Forms.forEach((form, idx) => {
                if (form.have_picture) form.imgPath = `/img/forms/${form.id}.png`;
                else form.imgPath = `/img/forms/default.png`;
                formsLine.push(form);
                if (idx % 4 === 0 && idx !== 0) {
                    formsArray.push(formsLine);
                    formsLine = [];
                }
            });
            if (formsLine.length !== 0) formsArray.push(formsLine);
            response.render('forms', {
                title: "Список форм",
                formsArray, isAdmin: request.user.isAdmin
            });
        } catch (err) { next(ApiError.internal(err.message)); }
    }
}

export default new FormController();