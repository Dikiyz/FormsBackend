export default class AnswersDto {
    id;
    name;
    user_name;
    user_id;

    constructor({ id, name, user_name, user_id }) {
        this.id = id;
        this.name = name;
        this.user_name = user_name;
        this.user_id = user_id;
    }
};