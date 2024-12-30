import httpError from "../middlewares/httpError.js"
import userModel from "../models/user.model.js"
import generateAccessToken from "../utils/generateAccessToken.js"
import generateRefreshToken from "../utils/generateRefreshToken.js"

const signUp = async (req, res, next) => {
    const {
        userName,
        fullName,
        email,
        password,
        coverImage,
        profileImage,
    } = req.body
    try {
        const user = await userModel.findOne({ $or: [{ userName: userName }, { email: email }] })
        // check existance
        if (user) return next(new httpError('There is someone with this userName and email Tray again.', 409))
        const newUser = new userModel({
            userName,
            fullName,
            email,
            password,
            coverImage,
            profileImage
        })
        await newUser.save()
        res.status(200).json({
            message: 'User Register Successfully.',
            user: {
                ...newUser._doc,
                password: undefined,
                status: 'success'
            }
        })
    } catch (error) {
        console.log(error)
        next(new httpError(error.message, 500))
    }
}
const signIn = async (req, res, next) => {
    const { userName, password } = req.body
    try {
        const user = await userModel.findOne({ userName })
        if (!user) return next(new httpError('Incorrect userName please Enter correct userName', 404))
        const isMatch = user.comparePassword(password)
        if (!isMatch) return next(new httpError('Incorrect password please Enter correct password',401))
        const userInfo = {
            userId: user._id,
            userName: user.userName,
            email: user.email
        }
        const accessToken = await generateAccessToken(userInfo, next)
        const refreshToken = await generateRefreshToken(userInfo, next)
        // set cookie 
        res.cookie('token', refreshToken)
        res.cookie('accessToken',accessToken)
        // save refresh token to database
        await userModel.findByIdAndUpdate(user._id, { refreshToken }, { new: true })
        res.status(200).json({
            message: 'successfully logged in',
            ...user._doc,
            password: undefined,
            accessToken,
            status: 'success'
        })
    } catch (error) {
        console.log(error)
        next(new httpError(error.message, 500))
    }
}
const logout = async (req, res, next) => {
    const cookie = req.cookies
    if (!cookie) return next(new httpError('Please Login is required', 401))
    const refreshToken = cookie.token
    if (!refreshToken) return next(new httpError('Please Login is required', 401))

    try {
        const user = await userModel.findOne({ refreshToken })
        if (!user) return next(new httpError('Please Login is required', 401))
        await userModel.findByIdAndUpdate(user._id, { refreshToken: '' }, { new: true })
        res.clearCookie('token')
        res.status(200).json({
            message: 'Successfully logout.',
            status: 'success'
        })
    } catch (error) {
        console.log(error)
        next(new httpError(error.message, 500))
    }
}
// get user by id 
const getUser = async (req, res, next) => {
    const { userId } = req.userInfo
    try {
        const user = await userModel.findById(userId)
        if (!user) return next(new httpError('No one found', 404))
        res.status(200).json({
            status: 'success',
            user:{
                ...user._doc,
                password:undefined,
                refreshToken:undefined
            },
        })
    } catch (error) {
        console.log(error)
        next(new httpError(error.message, 500))
    }

}
export {
    signIn,
    signUp,
    logout,
    getUser
}