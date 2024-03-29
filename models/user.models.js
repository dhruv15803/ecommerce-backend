import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    email: {
        type:String,
        required:true,
        lowercase:true,
        unique:true,
    },
    username: {
        type:String,
        required:true,
        lowercase:true,
        unique:true,
    },
    password: {
        type:String,
        required:true,
    },
    avatar: {
        type:String,
        required:true,
    },
    isAdmin: {
        type:Boolean,
        required:true,
        default:false,
    }
},{timestamps:true});

export const User = mongoose.model('User',userSchema);
