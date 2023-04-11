import jwt from "jsonwebtoken";
import { Token_DB } from "../database/index.js";

export default class TokenService {
    static async createTokens(payload) {
        const access_token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, { expiresIn: '30m' });
        const refresh_token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '15d' });

        return { access_token, refresh_token };
    }

    static async saveToken(user_id, refresh_token) {
        const token = await Token_DB.findOne({ where: { user_id } });
        if (token) {
            token.token = refresh_token;
            token.save();
            return token;
        }

        return await Token_DB.create({ user_id, token: refresh_token });
    }

    static validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
        } catch (err) { return null; }
    }

    static validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
        } catch (err) { return null; }
    }

    static async findToken(refresh_token) {
        return await Token_DB.findOne({ where: { token: refresh_token } });
    }

    static async removeToken(refresh_token) {
        return await Token_DB.destroy({ where: { token: refresh_token } });
    }
};