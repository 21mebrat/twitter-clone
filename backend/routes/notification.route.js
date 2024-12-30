import express from "express";
import {
    deleteNoification,
    deleteNoificationById,
    getNoification
} from "../controllers/notification.controller.js";
import auth from "../middlewares/auth.js";
// make router 
const router = express.Router()
router.get('/get',auth, getNoification)
router.delete('/delete',auth, deleteNoification)
router.delete('/delete/:id',auth, deleteNoificationById)

export default router