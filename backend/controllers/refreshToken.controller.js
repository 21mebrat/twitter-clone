import jwt from "jsonwebtoken"
import httpError from "../middlewares/httpError.js"
import userModel from "../models/user.model.js"
import generateAccessToken from "../utils/generateAccessToken.js"
const handleRefreshToken = async (req, res, next) => {
    const cookie = req.cookies
    if (!cookie) return next(new httpError('please loin frist', 401))
    const refreshToken = cookie.token

    if (!refreshToken) return next(new httpError('please loin frist', 401))
    try {
        const user = await userModel.findOne({ refreshToken })
        if (!user) return next(new httpError('please loin frist', 401))

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err && user._id !== decoded.userId) return next(new httpError('please loin frist', 401))
            const userInfo = {
                userId: user._id,
                userName: user.userName,
                email: user.email
            }
            console.log(decoded)
            const accessToken = await generateAccessToken(userInfo, next)
            res.status(200).json({
                message: 'successfully logged in',
                ...user._doc,
                password: undefined,
                accessToken,
                status: 'success'
            })
        })

    } catch (error) {
        next(new httpError(error.message, 500))
    }
}

export default handleRefreshToken