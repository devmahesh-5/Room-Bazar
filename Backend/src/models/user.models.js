import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validate } from "node-cron";
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleId:{
        type: String
    },
    password: {
        type: String,
        required: function () {
            // Required only if no Google ID (i.e., normal signup)
            return !this.googleId;
          }
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    verificationAttempts:{
        type: Number,
        default: 0
    },
    unVerified_at:{
        type: Date,
        default: Date.now
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    
    phone : {
        type: String,
        unique: true,
        required:function () {
            // Required only if no Google ID (i.e., normal signup)
            return !this.googleId;
          }
    },
    address : {
        type: String,
        required: function () {
            // Required only if no Google ID (i.e., normal signup)
            return !this.googleId;
          }

    },
    gender : {
        type: String,
        required: function () {
            // Required only if no Google ID (i.e., normal signup)
            return !this.googleId;
          }
    },
    latitude : {
        type: Number
    },
    longitude : {
        type: Number
    },
    avatar : {
        type: String
    },
    coverImage : {
        type: String,
    },
    refreshToken : {
        type : String
    },
    role : {
        type : String,
        enum : ['User', 'Admin'],
        default : 'User'
    },
   location : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Location'
    }

},
    {
        timestamps: true
    }
);

userSchema.pre('save',async function (next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken =  function () {
    return jwt.sign({ id: this._id },
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ id: this._id },
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
}
const User = mongoose.model('User', userSchema);
export default User
