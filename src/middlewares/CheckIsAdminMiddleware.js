import env from "dotenv";
import ApiError from "../ApiError.js";
import TokenService from "../services/TokenService.js";
env.config();

export default function (request, response, next) {
    try {
        const token = request.cookies.refresh_token;
        if (!token) return next(ApiError.badRequest("Вы не авторизованы."));
        const userData = TokenService.validateRefreshToken(token);
        if (!userData) return next(ApiError.badRequest("Вы не авторизованы."));
        if (!userData.isAdmin) return next(ApiError.badRequest("У Вас нет доступа."));

        request.user = userData;
        next();
    } catch (err) { next(ApiError.badRequest("У Вас нет доступа.")) }
};