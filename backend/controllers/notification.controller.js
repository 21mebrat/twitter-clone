import httpError from "../middlewares/httpError.js"
import notificationModel from "../models/notification.model.js"

const getNoification = async (req, res, next) => {
    const userId = req.userInfo.userId
    try {
        const notifications = await notificationModel.find({ to: userId }).populate({
            path: 'from',
            select: 'userName profileImage'
        })
        await notificationModel.updateMany({ to: userId }, { read: true })
        if (notifications) {
            return res.status(200).json({
                status: 'success',
                notifications
            })
        } else {
            return res.status(200).json({
                status: 'success',
                notifications: []
            })
        }
    } catch (error) {
        next(new httpError(error.message, 500))
    }
}
const deleteNoification = async (req, res, next) => {
    const userId = req.userInfo.userId
    try {
        await notificationModel.deleteMany({ to: userId })
        res.status(200).json({
            status: 'success',
            message: 'successfully deleted'
        })
    } catch (error) {
        next(new httpError(error.message, 500))
    }
}
const deleteNoificationById = async (req, res, next) => {
    const userId = req.userInfo.userId
    const notificationId = req.params.id

    try {
        const notification = await notificationModel.findById(notificationId)
        if (!notification) return next(new httpError('notification are not found', 401))
        if (notification.to.toString() !== userId.toString()) return next(new httpError('You can not delete this notification', 401))
        await notificationModel.findByIdAndDelete(notificationId)
        res.status(200).json({
            status: 'success',
            message: 'successfully deleted'
        })
    } catch (error) {
        next(new httpError(error.message, 500))
    }
}

export {
    getNoification,
    deleteNoification,
    deleteNoificationById
}