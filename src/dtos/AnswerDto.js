export default class AnswersDto {
    form_name;
    user_name;
    user_id;
    question;
    answer;
    form_id;

    constructor({ question, answer, form_name, user_name, user_id, form_id }) {
        this.question = question;
        this.form_id = form_id;
        this.answer = answer;
        this.form_name = form_name;
        this.user_name = user_name;
        this.user_id = user_id;
    }
};