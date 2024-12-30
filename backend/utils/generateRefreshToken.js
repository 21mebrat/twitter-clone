import jwt from "jsonwebtoken";
import httpError from "../middlewares/httpError.js";

const generateRefreshToken = (userInfo, next) => {
    try {
        return jwt.sign(userInfo, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn:'15m'
        })
    } catch (error) {
        return next(new httpError(error.message, 500))
    }
}

export default generateRefreshToken