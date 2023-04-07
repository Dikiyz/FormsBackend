import env from "dotenv";
import ApiError from "../ApiError.js";
env.config();

export default function (request, response, next) {
    try {
        if (!request.session.user) return next(ApiError.badRequest("Вы не авторизованы."));
        if (!request.session.user.isAdmin) return next(ApiError.badRequest("У Вас нет доступа."));
        next();
    } catch (err) { next(ApiError.internal(err.message)) }
};