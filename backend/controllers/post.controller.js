import httpError from "../middlewares/httpError.js"
import notificationModels from "../models/notification.model.js"
import postModel from "../models/post.model.js"
import userModel from "../models/user.model.js"
// get all posts 
const getAllPosts = async (req, res, next) => {
    try {
        const posts = await postModel.find({}).sort({ cratedAt: -1 }).populate({
            path: 'user',
            select: ['-password', '-refreshToken']
        }).populate({
            path: "Comments.user",
            select: ['-password', '-refreshToken']

        })
        if (posts.length === 0) {
            return res.status(200).json({
                posts: [],
                status: 'success'
            })
        }
        res.status(200).json({
            status: 'success',
            posts
        })

    } catch (error) {
        next(new httpError(error.message, 500))

    }

}
// get likedPosts
const getLikedPosts = async (req, res, next) => {
    const userId = req.params.id
    console.log('yes it we are it')
    try {
        const user = await userModel.findById(userId)
        if (!user) return next(new httpError('user not found', 404))
        const likedPosts = await postModel.find({ _id: { $in: user.likedPosts } })
            .populate({
                path: 'user',
                select: ['-password', 'refreshToken']
            }).populate({
                path: 'Comments.user',
                select: ['-password', 'refreshToken']
            })
        res.status(200).json({
            status: 'success',
            likedPosts
        })
    } catch (error) {
        console.log(error)
        next(new httpError(error.message, 500))
    } 

}
const getFollowingPosts = async (req, res, next) => {
    const userId = req.userInfo.userId
    try {
        const user = await userModel.findById(userId)
        if (!user) return next(new httpError('user not found', 404))
        const following = user.following
        const feedPosts = await postModel.find({ user: { $in: following } })
            .populate({ 
                path: 'user',
            select: '-password'
            }).populate({
                path: 'Comments.user',
                select: '-password'
            })
        res.status(200).json({
            status: 'success',
            feedPosts
        })
    } catch (error) {
        console.log(error)
        next(new httpError(error.message, 500))
    }

}
const getMyPosts = async (req, res, next) => {
    const userName = req.userInfo.userName
    try {
        const user = await userModel.findOne({userName})
        if (!user) return next(new httpError('user not found', 404))
        const myPost = await postModel.find({ user: user._id })
            .populate({ 
                path: 'user',
            select: '-password'
            }).populate({
                path: 'Comments.user',
                select: '-password'
            })
        res.status(200).json({
            status: 'success',
            myPost
        })
    } catch (error) {
        console.log(error)
        next(new httpError(error.message, 500))
    }

}
const CreatePost = async (req, res, next) => {
    const { text, img } = req.body
    const userId = req.userInfo.userId

    try {
        const user = await userModel.findById(userId)
        console.log('yes', userId)
        if (!user) return next(new httpError('unauthorized user', 401))
        const newPost = new postModel({
            user: userId,
            text,
            img
        })
        await newPost.save()
        res.status(200).json({
            message: 'successfully posted',
            status: 'success',
            post: {
                ...newPost._doc
            }
        })

    } catch (error) {
        next(new httpError(error.message, 500))
    }
}
const likeUnLikePost = async (req, res, next) => {
    const postId = req.params.id
    const { userId } = req.userInfo
    console.log(userId)
    try {
        const post = await postModel.findById(postId)
        if (!post) return next(new httpError('post are not found', 404))
        const isLiked = post.likes.includes(userId)
        if (isLiked) {
            //unlike
            await postModel.updateOne({ _id: postId }, { $pull: { likes: userId } })
            await userModel.updateOne({ _id: userId }, { $pull: { likedPosts: postId } })
            res.status(200).json({
                status: 'success'
            })
        } else {
            // likeli
            post.likes.push(userId)
            await userModel.updateOne({ _id: userId }, { $push: { likedPosts: postId } })
            await post.save()
            const notification = new notificationModels({
                from: userId,
                to: post.user,
                type: 'like'
            })
            await notification.save()
            res.status(200).json({
                status: 'success',
                message: 'successfully liked'
            })
        }
    } catch (error) {
        next(new httpError(error.message, 500))
    }
}
const commentPost = async (req, res, next) => {
    const { text } = req.body
    const postId = req.params.id
    const userId = req.userInfo.userId

    try {
        const post = await postModel.findById(postId)
        if (!postId) return next(new httpError('Post are not found', 404))
        const comment = { user: userId, text }
        post.Comments.push(comment)
        await post.save()
        res.status(200).json({
            message: 'successfully post the comment',
            status: 'success',
            comments: post.Comments
        })
    } catch (error) {
        next(new httpError(error.message, 500))
    }
}
const deletePost = async (req, res, next) => {
    try {
        const post = await postModel.findById(req.params.id)
        if (!post) return next(new httpError('post are not found', 404))
        if (post.user.toString() !== req.userInfo.userId.toString()) return next(new httpError('Can not delete this ', 401))

        // add cloundinariy code to delete

        res.status(200).json({
            message: 'successfully deleted',
            status: 'success'
        })
    } catch (error) {
        next(new httpError(error.message, 500))
    }
}

export {
    deletePost,
    likeUnLikePost,
    CreatePost,
    commentPost,
    getAllPosts,
    getLikedPosts,
    getFollowingPosts,
    getMyPosts
}