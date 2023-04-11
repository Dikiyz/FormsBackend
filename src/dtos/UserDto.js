export default class UserDto {
    id;
    name;
    login;
    email;
    isAdmin;

    constructor ({ id, name, login, email, isAdmin }) {
        this.id = id;
        this.name = name;
        this.login = login;
        this.email = email;
        this.isAdmin = isAdmin;
    }
};