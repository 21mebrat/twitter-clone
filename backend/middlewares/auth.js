import jwt from "jsonwebtoken"
import httpError from "./httpError.js"

const auth = async (req, res, next) => {
    // const authHeader =  req.headers.Authorization || req.headers.authorization
    // console.log(authHeader)
    // if (!authHeader) return next(new httpError('Authorization header is not sent', 401))
    //     console.log('upto this work')
    const cookie = req.cookies
    if (!cookie) return next(new httpError('please loin frist', 401))
    const token = cookie.accessToken
    if (!token) return next(new httpError('Token is not found Please login again', 401))
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userInfo) => {
            if (err) return next(new httpError('Invalid Token Please login again', 403))
            req.userInfo = userInfo
            next()
        })
    } catch (error) {
        next(new httpError(error.message, 500))
    }

}

export default auth