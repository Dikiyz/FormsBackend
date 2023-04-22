import ApiError from "../ApiError.js";
import { Answer_DB, Form_Answer_DB, Form_DB, User_DB } from "../database/index.js";
import FormService from "./FormService.js";
import AnswersDto from "../dtos/AnswersDto.js";
import AnswerDto from "../dtos/AnswerDto.js";
import Op from 'sequelize';

class AnswerService {
    async getAnswers(onlyUserAnswers = false) {
        const answers = onlyUserAnswers ? await Form_Answer_DB.findAll({
            order: [['id', 'DESC']], limit: 100, include: [{
                model: User_DB,
                where: { id: parseInt(onlyUserAnswers) },
                required: true
            }, {
                model: Form_DB,
                required: true
            }]
        }) : await Form_Answer_DB.findAll({
            order: [['id', 'DESC']], limit: 100, include: [{
                model: User_DB,
                required: true
            }, {
                model: Form_DB,
                required: true
            }]
        });

        console.log(JSON.stringify(answers))

        const AnswersDtos = [];
        answers.forEach(answer => {
            answer.user_name = answer.user.name;
            answer.name = answer.form.name;
            answer.user_id = answer.user.id;
            AnswersDtos.push(new AnswersDto(answer));
        });

        return AnswersDtos;
    }

    async getAnswer(id) {
        const answers = await Answer_DB.findAll({
            where: { form_answer_id: id }, include: [{
                model: Form_Answer_DB,
                required: true, include: [{
                    model: Form_DB,
                    required: true
                }, {
                    model: User_DB,
                    required: true
                }]
            }]
        });

        const answersDto = [];
        answers.forEach(answer => {
            answer.form_id = answer.form_answer.form.id;
            answer.form_name = answer.form_answer.form.name;
            answer.user_id = answer.form_answer.user.id;
            answer.user_name = answer.form_answer.user.name;
            answersDto.push(new AnswerDto(answer));
        });

        return answersDto;
    }

    async addAnswersToForm(user_id, form_id, answers) {
        const Form = await FormService.getById(form_id);
        if (answers.length !== Form.questions.length) throw ApiError.badRequest("Вы ответили не на все вопросы.");
        const FormsAnswer = await Form_Answer_DB.create({ user_id: user_id, form_id: Form.id });
        try {
            for (let answer in answers) await Answer_DB.create({
                form_answer_id: FormsAnswer.id,
                question: answers[answer].question.name,
                type: answers[answer].question.type,
                answer: answers[answer].text
            });
        } catch (err) {
            Form_Answer_DB.destroy({ where: { id: FormsAnswer.id } });
            throw err;
        }
    }
}

export default new AnswerService();