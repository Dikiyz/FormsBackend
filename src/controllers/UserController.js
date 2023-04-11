import ApiError from "../ApiError.js";
import env from "dotenv";
import { User_DB } from "../database/index.js";
import { Op } from "sequelize";
import UserService from "../services/UserService.js";

env.config();

class UserController {
    async signUp(request, response, next) {
        try {
            if (request.cookies.refresh_token) return next(ApiError.badRequest("Вы уже авторизованы."));
            const user = await UserService.registration(request.body.name, request.body.login, request.body.email, request.body.password);
            response.cookie('refresh_token', user.refresh_token, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            response.status(200).json({ id: user.id, logined: true });
        } catch (err) { next(ApiError.internal(err.message)); }
    }

    async logIn(request, response, next) {
        try {
            if (request.cookies.refresh_token) return next(ApiError.badRequest("Вы уже авторизованы."));
            const user = await UserService.authorization(request.body.login, request.body.password);
            response.cookie('refresh_token', user.refresh_token, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            response.cookie('access_token', user.access_token, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            response.status(200).json({ id: user.id, logined: true });
        } catch (err) { next(ApiError.internal(err.message)); }
    }

    async refresh(request, response, next) {
        try {
            const { refresh_token } = request.cookies;
            if (!refresh_token) return next(ApiError.badRequest("Вы не авторизованы."));
            const user = await UserService.refresh(refresh_token);
            response.cookie('refresh_token', user.refresh_token, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            response.status(200).json({ id: user.id, logined: true });
        } catch (err) { next(ApiError.internal(err.message)); }
    }

    async logOut(request, response, next) {
        try {
            const { refresh_token } = request.cookies;
            if (!refresh_token) return next(ApiError.badRequest("Вы не авторизованы."));
            const token = await UserService.logOut(refresh_token);
            response.clearCookie('refresh_token');
            response.status(200).json({ logined: false });
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