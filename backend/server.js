import express from "express";
import dotenv from 'dotenv'
import dbConnection from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import handleRefreshToken from "./controllers/refreshToken.controller.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import notificationRouter from "./routes/notification.route.js";
dotenv.config()
const app = express()
// built in middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
// auth middleware
app.use('/api/twitter-clone/auth', authRouter)
app.use('/api/twitter-clone/user', userRouter)
app.get('/api/refresh', handleRefreshToken)
// post routes
app.use('/api/twitter-clone/post', postRouter)
//notification routes
app.use('/api/twitter-clone/notification', notificationRouter)

// errror router
app.use((err, req, res, next) => {
	if (err.isOperational) {
		err.statusCode = err.statusCode || 500
		err.status = err.status || 'error'
		err.message = err.message || 'something go wrong'
		res.status(err.statusCode).json({
			message: err.message,
			status: err.status
		})
	} else {
		res.status(500).json({
			message: 'something go wrong',
			status: 'error'
		})
	}
})

const runServer = () => {
	dbConnection()
	app.listen(process.env.PORT, () => console.log(`server run on port ${process.env.PORT}`))
}
runServer()