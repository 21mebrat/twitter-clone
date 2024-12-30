import jwt from "jsonwebtoken";
import httpError from "../middlewares/httpError.js";

const generateAccessToken = (userInfo, next) => {
    try {
        return jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn:'15h'
        })
    } catch (error) {
        return next(new httpError(error.message, 500))
    }
}

export default generateAccessToken