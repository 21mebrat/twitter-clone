import express from "express";
import { commentPost, CreatePost, deletePost, getAllPosts, getFollowingPosts, getLikedPosts, getMyPosts, likeUnLikePost } from "../controllers/post.controller.js";
import auth from "../middlewares/auth.js";
// make router 
const router = express.Router()
router.post('/create', auth, CreatePost)
router.get('/get-all',auth, getAllPosts)
router.get('/get-followingposts',auth, getFollowingPosts)
router.get('/get-myposts/:userName',auth, getMyPosts)
router.post('/like-unlike/:id',auth, likeUnLikePost)
router.get('/liked-posts/:id',auth, getLikedPosts)
router.post('/comment/:id',auth, commentPost)
router.delete('/delete/:id',auth, deletePost)

export default router 