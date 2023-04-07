import bcrypt from "bcrypt";
import ApiError from "../ApiError.js";
import env from "dotenv";
import { User_DB } from "../database/index.js";
import { Op } from "sequelize";

env.config();

class UserController {
    async signUp(request, response, next) {
        try {
            if (request.session.user) return next(ApiError.badRequest("Вы уже авторизованы."));

            let { login, email, password, name } = request.body;

            login = login.replace(/[^a-zA-Z0-9]/, '').toLowerCase();
            password = password.replace(/[^a-zA-Z0-9]/, '');
            email = email.replace(/[^a-zA-Z0-9.@]/, '');
            name = name.replace(/[^a-zA-Z0-9]/, '');

            console.log(2);
            if (!login || !password) return next(ApiError.badRequest(`${!login ? 'Логин' : 'Пароль'} не указан.`));
            if (!email) return next(ApiError.badRequest(`E-Mail не указан.`));
            if (!name) return next(ApiError.badRequest(`Имя не указано.`));
            console.log(3);

            if (login.length < 4 || login.length > 20) return next(ApiError.badRequest(`Логин должен быть не менее 4-ёх и не более 20-ти символов.`));
            if (password.length < 6 || password.length > 20) return next(ApiError.badRequest(`Пароль должен быть не менее 6-ти и не более 20-ти символов.`));
            if (name.length < 6 || name.length > 20) return next(ApiError.badRequest(`Имя должено быть не менее 6-ти и не более 20-ти символов.`));
            password = await bcrypt.hash(password, 5);

            if (await User_DB.findOne({
                where: {
                    [Op.or]: [
                        { login: { [Op.eq]: login } },
                        { email: { [Op.eq]: email } }
                    ]
                }
            })) return next(ApiError.badRequest("Пользователь с таким login или email уже зарегестрирован."))

            // TODO: E-mail require.

            const user = await User_DB.create({ login: login, password: password, name: name, email: email });

            request.session.user = user;
            response.status(200).json({ id: user.id, logined: true });
        } catch (err) { next(ApiError.internal(err.message)); }
    }

    async logIn(request, response, next) {
        try {
            if (request.session.user) return next(ApiError.badRequest("Вы уже авторизованы."));

            const { login, password } = request.query;
            if (!login || !password) return next(ApiError.badRequest(`${!login ? 'Логин' : 'Пароль'} не указан.`));

            const user = await User_DB.findOne({ where: { [Op.and]: [{ login: login }, { password: password }] } });
            if (!user) return next(ApiError.badRequest("Пользователь с таким логином и паролем не зарегистрирован."));

            request.session.user = user;
            response.status(200).json({ id: user.id, logined: true });
        } catch (err) { next(ApiError.internal(err.message)); }
    }

    async logOut(request, response, next) {
        try {

        } catch (err) { next(ApiError.internal(err.message)); }
    }

    async authorization(request, response, next) {
        try {
            const isRegistration = request.query.registration == 1;
            response.render('authorization', {
                title: isRegistration ? `Регистрация` : `Авторизация`,
                isAuthorization: !isRegistration
            });
        } catch (err) { next(ApiError.internal(err.message)); }
    }
}

export default new UserController();