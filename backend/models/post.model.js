import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: String,
    img: String,
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    Comments: [
        {
            text: {
                type: String,
                require: true
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref:'User',
                require: true
            }
        }
    ]
})

const postModel = mongoose.model('Post', postSchema)
export default postModel