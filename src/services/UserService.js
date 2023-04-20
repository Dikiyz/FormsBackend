import TokenService from "./TokenService.js";
import UserDto from "../dtos/UserDto.js";
import { User_DB } from "../database/index.js";
import { Op } from "sequelize";
import ApiError from "../ApiError.js";
import crypto from "crypto";


export default class UserService {
    static async registration(name, login, email, password) {
        login = login.replace(/[^a-zA-Z0-9]/, '').toLowerCase();
        password = password.replace(/[^a-zA-Z0-9]/, '');
        email = email.replace(/[^a-zA-Z0-9.@]/, '');
        name = name.replace(/[^a-zA-Z0-9]/, '');

        if (!login || !password) throw ApiError.badRequest(`${!login ? 'Логин' : 'Пароль'} не указан.`);
        if (!email) throw ApiError.badRequest(`E-Mail не указан.`);
        if (!name) throw ApiError.badRequest(`Имя не указано.`);

        if (login.length < 4 || login.length > 20) throw ApiError.badRequest(`Логин должен быть не менее 4-ёх и не более 20-ти символов.`);
        if (password.length < 6 || password.length > 20) throw ApiError.badRequest(`Пароль должен быть не менее 6-ти и не более 20-ти символов.`);
        if (name.length < 6 || name.length > 20) throw ApiError.badRequest(`Имя должено быть не менее 6-ти и не более 20-ти символов.`);
        password = crypto.createHash("sha256").update(password).digest("hex");

        if (await User_DB.findOne({
            where: {
                [Op.or]: [
                    { login: { [Op.eq]: login } },
                    { email: { [Op.eq]: email } }
                ]
            }
        })) throw ApiError.badRequest('Пользователь с таким login или email уже зарегестрирован.');

        // TODO: E-mail require.

        const user = await User_DB.create({ login: login, password: password, name: name, email: email });
        const user_dto = new UserDto(user);
        const tokens = await TokenService.createTokens({ ...user_dto });
        await TokenService.saveToken(user.id, tokens.refresh_token);
        return { ...tokens, user: user_dto };
    }

    static async authorization(login, password) {
        if (!login || !password) throw ApiError.badRequest(`${!login ? 'Логин' : 'Пароль'} не указан.`);
        password = crypto.createHash("sha256").update(password).digest("hex");

        const user = await User_DB.findOne({ where: { [Op.and]: [{ login: login }, { password: password }] } });
        if (!user) throw ApiError.badRequest("Пользователь с таким логином и паролем не зарегистрирован.");
        const user_dto = new UserDto(user);
        const tokens = await TokenService.createTokens({ ...user_dto });
        await TokenService.saveToken(user.id, tokens.refresh_token);
        return { ...tokens, user: user_dto };
    }

    static async refresh(refresh_token) {
        const data = TokenService.validateRefreshToken(refresh_token);
        const DB_Token = await TokenService.findToken(refresh_token);
        if (!data || !DB_Token) throw ApiError.badRequest("Вы не авторизрованы.");

        const user = await User_DB.findByPk(data.id);
        const user_dto = new UserDto(user);
        const tokens = await TokenService.createTokens({ ...user_dto });
        await TokenService.saveToken(user.id, tokens.refresh_token);
        return { ...tokens, user: user_dto };
    }

    static async logOut(refresh_token) {
        return await TokenService.removeToken(refresh_token);
    }
}