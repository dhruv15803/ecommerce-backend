import jwt from 'jsonwebtoken';
import { User } from '../models/user.models.js';
import dotenv from 'dotenv'
dotenv.config({
    path:"../.env"
})
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'
import { adminUser } from '../index.js';


          
cloudinary.config({ 
  cloud_name: 'dqcptinzd', 
  api_key: '792156251912376', 
  api_secret: 'jkxJ8U74dhrEtqWczC3_aTczQrw' 
});

const isAdmin = (username,password,email)=>{
    if(username===adminUser.username && password===adminUser.password && email===adminUser.email){
        return true;
    }
    else{
        return false;
    }
}


const registerUser = async (req,res)=>{
try {
        const {email,username,password} = req.body;
        console.log(req.body);
        if(email.trim()==="" || username.trim()==="" || password.trim()===""){
            res.status(400).json({
                "success":false,
                "message":"Please enter all required fields",
            })
            return;
        }
        const isUserRegistered = await User.findOne({email});
        if(isUserRegistered){
            res.status(400).json({
                "success":false,
                "message":"user already exists",
            })
            return;
        }

        const response = await cloudinary.uploader.upload(req.file.path,{
            resource_type:"auto"
        })

        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({email,username,password:hashedPassword,avatar:response.url,isAdmin:isAdmin(username,password,email)});
        res.json({
            "success":true,
            "message":"user registered successfully",
            user,
        })
        fs.unlinkSync(req.file.path);
} catch (error) {
    console.log('registering error ',error);   
}
}

const loginUser = async (req,res)=>{
try {
        const {email,password} = req.body;
        if(email.trim()==="" || password.trim()===""){
            res.status(400).json({
                "success":false,
                "message":"please enter all the required fields",
            })
            return;
        }
        // check if user is registerd and check if password is correct
        const user = await User.findOne({email});
        if(!user){
            res.status(400).json({
                "success":false,
                "message":"Email or password are not correct",
            })
            return;
        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            res.status(400).json({
                "success":false,
                "message":"Email or password are not correct",
            })
            return;
        }
        const token = jwt.sign({
            _id:user._id,
            username:user.username,
            email:user.email,
            password:user.password,
            avatar:user.avatar,
        },process.env.JWT_SECRET,{
            expiresIn:'1d',
        })
        res.cookie('accessToken',token,{
            httpOnly:true,
        })
        res.status(200).json({
            "success":true,
            "message":"user logged in successfully",
            user,
        })
} catch (error) {
    console.log(error);
}
}

const getLoggedIn = async (req,res)=>{
try {
        if(!req.cookies?.accessToken){
            res.json({
                "success":false,
                "message":"user not logged in",
            })
            return;
        }
        const decodedToken = jwt.verify(req.cookies?.accessToken,process.env.JWT_SECRET);
        console.log(decodedToken);
        const user = await User.findOne({_id:decodedToken._id});
        res.status(200).json({
            "success":true,
            user,
        })
} catch (error) {
    console.log(error);
}
}

const logoutUser = async (req,res)=>{
    if(!req.cookies?.accessToken){
        res.json({
            "success":false,
            "message":"cannot logout if not logged in",
        })
        return;
    }
    res.clearCookie('accessToken');
    res.json({
        "success":true,
        "message":"user logged out successfully"
    })
}

const editAvatar = async (req,res)=>{
    try {
    // need to be logged in
    if(!req.cookies?.accessToken){
        res.json({
            "success":false,
            "message":"need to be logged in to edit avatar"
        })
        return;
    }
    const decodedToken = jwt.verify(req.cookies.accessToken,process.env.JWT_SECRET);

    const response = await cloudinary.uploader.upload(req.file.path,{
        resource_type:"auto"
    })

    const user = await User.updateOne({_id:decodedToken._id},{$set:{avatar:response.url}})
    res.json({
        "success":true,
        "message":"avatar updated successfully",
    })
    } catch (error) {
      console.log(error);  
    }
}

const editUsername = async (req,res)=>{
try {
        const {newUsername} = req.body;
        if(!req.cookies?.accessToken){
            res.json({
                "success":false,
                "message":"need to be logged in to edit username"
            })
            return;
        }
        const decodedToken = jwt.verify(req.cookies.accessToken,process.env.JWT_SECRET);
        console.log(newUsername);
        const isUsernameInDb = await User.findOne({username:newUsername});
        if(isUsernameInDb){
            res.json({
                "success":false,
                "message":"This username already exists",
            })
            return;
        }
        const user = await User.updateOne({_id:decodedToken._id},{$set:{username:newUsername}});
        res.json({
            "success":true,
            "message":"username successfully updated",
        })
} catch (error) {
    console.log(error);
}
}


const editPassword = async (req,res)=>{
try {
        const {newPassword} = req.body;
        if(!req.cookies?.accessToken){
            res.json({
                "success":false,
                "message":"need to be logged in to edit username"
            })
            return;
        }
        const decodedToken = jwt.verify(req.cookies.accessToken,process.env.JWT_SECRET);
        const newHashedPassword = await bcrypt.hash(newPassword,10);
        const user = await User.updateOne({_id:decodedToken._id},{$set:{password:newHashedPassword}});
        res.json({
            "success":true,
            "message":"password successfully updated",
        })
} catch (error) {
    console.log(error);
}
}

export {registerUser,loginUser,getLoggedIn,logoutUser,editAvatar,editUsername,editPassword};
