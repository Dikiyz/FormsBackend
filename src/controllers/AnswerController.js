import ApiError from '../ApiError.js';
import AnswerService from '../services/AnswerService.js';

class AnswerController {
    async getMy(request, response, next) {
        try {
            console.log(1)
            const answers = await AnswerService.getAnswers(request.user.id);
            response.render('answers', { answers, title: "Ответы", isAdmin: request.user.isAdmin });
        } catch (err) { next(ApiError.internal(err.message)); }
    }

    async getAll(request, response, next) {
        try {
            const answers = await AnswerService.getAnswers();
            response.render('answers', { answers, title: "Ответы", isAdmin: request.user.isAdmin });
        } catch (err) { next(ApiError.internal(err.message)); }
    }

    async getOne(request, response, next) {
        try {
            const answers = await AnswerService.getAnswer(request.params.id);
            response.render('answer', {
                title: `Ответ #${request.params.id}`,
                answers, isAdmin: request.user.isAdmin
            });
        } catch (err) { next(ApiError.internal(err.message)); }
    }

    async addNew(request, response, next) {
        try {
            const { form_id, answers } = request.body;
            await AnswerService.addAnswersToForm(request.user.id, form_id, answers);
            response.status(200).json({ message: "Ответ успешно записан!" });
        } catch (err) { next(ApiError.internal(err.message)); }
    }
}

export default new AnswerController();