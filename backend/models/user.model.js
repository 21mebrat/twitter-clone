import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
// user schema
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: true
    },
    fullName: {
        type: String,
        required: true
    }, 
    password: {
        type: String,
        required: true,
        minLength: 4
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowerCase: true
    },
    follower: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    refreshToken:{
        type:String,
        default:''
    },
    profileImage: {
        type: String,
        default: ''
    },
    coverImage: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    link: {
        type: String,
        default: ''
    },
    likedPosts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Post',
            default:[]
        }
    ]
}, { timestamps: true })

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
    const user = this;

    // Only hash the password if it is new or modified
    if (!user.isModified('password')) {
        return next();
    }

    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt
        user.password = await bcrypt.hash(user.password, salt);
        next(); // Proceed to save the user
    } catch (error) {
        next(error); // Pass error to the next middleware
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model('User', userSchema)

export default userModel