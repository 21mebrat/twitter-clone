import httpError from "../middlewares/httpError.js"
import notificationModel from "../models/notification.model.js"
import userModel from "../models/user.model.js"
const getUserProfile = async (req, res, next) => {
    const { userName } = req.params
    console.log(userName, 'username')
    try {
        const user = await userModel.findOne({ userName })
        if (!user) return next(new httpError('No one found', 404))
        res.status(200).json({
            status: 'success',
            user: {
                ...user._doc,
                password: undefined,
                refreshToken: undefined
            },
        })
    } catch (error) {
        console.log(error)
        next(new httpError(error.message, 500))
    }

}
const updateUserProfile = async (req, res, next) => {
    const {
        fullName,
        userName,
        email,
        bio,
        link,
        newPassword,
        currentPassword,
    } = req.body
    try {
        const user = await userModel.findById(req.userInfo.userId)
        if (!user) return next(new httpError('No one found', 404))
        const isMatch = user.comparePassword(currentPassword)
        if (!isMatch) return next(new httpError('incorrect password palease enter correct one', 401))
        user.fullName = fullName
        user.userName = userName
        user.email = email
        user.bio = bio
        user.link = link
        user.password = newPassword
        await user.save()
        res.status(200).json({
            message: 'successfully updated',
            status: 'success',
            user: {
                ...user._doc,
                password: undefined
            }
        })
        res.send('get Profile')
    } catch (error) {
        console.log(error)
        next(new httpError(error.message, 500))
    }

}
const sugestedUsers = async (req, res, next) => {
    const userId = req.userInfo.userId
    try {
        const UserIFollow = await userModel.findById(userId).select("following")
        const users = await userModel.aggregate([
            {
                $match: {
                    _id: {
                        $ne: userId
                    }
                }
            },
            {
                $sample: {
                    size: 10
                }
            }
        ])
        const FileterUnfollowing = users.filter(user => !UserIFollow.following.includes(user._id))
        const sugestedUsers = FileterUnfollowing.slice(0, 4)
        sugestedUsers.forEach(user => user.password = null)
        res.status(200).json(sugestedUsers)
    } catch (error) {
        next(new httpError(error.message, 500))
    }

}
const followAndUnfollow = async (req, res, next) => {
	try {
		const { id } = req.params;
		const userToModify = await userModel.findById(id);
		const currentUser = await userModel.findById(req.userInfo.userId);

		if (id === req.userInfo.userId.toString()) {
			return res.status(400).json({ error: "You can't follow/unfollow yourself" });
		}

		if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			// Unfollow the user
			await userModel.findByIdAndUpdate(id, { $pull: { follower: req.userInfo.userId } });
			await userModel.findByIdAndUpdate(req.userInfo.userId, { $pull: { following: id } });

			res.status(200).json({ message: "User unfollowed successfully" });
		} else {
			// Follow the user
			await userModel.findByIdAndUpdate(id, { $push: { follower: req.userInfo.userId } });
			await userModel.findByIdAndUpdate(req.userInfo.userId, { $push: { following: id } });
			// Send notification to the user
			const newNotification = new notificationModel({
				type: "follow",
				from: req.userInfo.userId,
				to: userToModify._id,
			});

			await newNotification.save();

			res.status(200).json({ message: "User followed successfully" });
		}
	} catch (error) {
		console.log("Error in followUnfollowUser: ", error.message);
		res.status(500).json({ error: error.message });
	}

}

export {
    getUserProfile,
    followAndUnfollow,
    updateUserProfile,
    sugestedUsers
}