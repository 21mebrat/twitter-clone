import express from "express";
import { followAndUnfollow, getUserProfile, sugestedUsers, updateUserProfile } from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";
// make router 
const router = express.Router()
router.get('/get-profile/:userName', getUserProfile)
router.post('/update-profile',auth, updateUserProfile)
router.get('/sugested-user',auth, sugestedUsers)
router.post('/follow/:id', auth, followAndUnfollow)

export default router 