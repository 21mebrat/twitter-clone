import express from "express";
import {
    signUp,
    signIn,
    logout,
    getUser,
} from '../controllers/auth.controller.js'
import auth from "../middlewares/auth.js";
// make router 
const router = express.Router() 
router.post('/signup', signUp)
router.post('/signin', signIn)
router.get('/logout', logout)
router.get('/get/', auth, getUser)

export default router