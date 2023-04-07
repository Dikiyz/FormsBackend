import env from "dotenv";
import ApiError from "../ApiError.js";
env.config();

// TODO: Refactoring...
export default function (request, response, next) {
    if (request.method === "OPTIONS") next();
    try {
        if (!request.session.user) return next(ApiError.badRequest("Вы не авторизованы."));
        next();
    } catch (err) { next(ApiError.internal(err.message)) }
};