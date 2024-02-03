import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose'
import { editAvatar, editPassword, editUsername, getLoggedIn, loginUser, logoutUser, registerUser } from './controllers/user.controllers.js';
import fs from 'fs';
import multer from 'multer'
import { addProduct, editProduct, getAllProducts, getProductById, getProductsByCategory } from './controllers/product.controller.js';
import cors from 'cors'
dotenv.config({
    path:'./.env'
})
const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './Public');
    },
    filename: function (req, file, cb) {
      cb(null,file.originalname);
    }
})

const upload = multer({storage:storage});

const connectToDb = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/ecommerce-db`);
        console.log('DB CONNECTED');
       
    } catch (error) {
        console.log('DB CONNECTION FAILED :',error);        
    }
}

connectToDb();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}))


// USER ROUTES
app.post('/user/register',upload.single('avatar'),registerUser);
app.post('/user/login',loginUser);
app.get('/user/loggedInUser',getLoggedIn);
app.get('/user/logout',logoutUser);
app.patch('/user/editAvatar',upload.single('newAvatar'),editAvatar);
app.patch('/user/editUsername',editUsername);
app.patch('/user/editPassword',editPassword);

// PRODUCT ROUTES
app.post('/product/add',upload.single('productThumbnail'),addProduct);
app.get('/product/getAll',getAllProducts);
app.put('/product/editProduct',upload.single('newProductThumbnail'),editProduct);
app.get('/product',getProductsByCategory);
app.get('/product/:id',getProductById);

app.listen(process.env.PORT,()=>{
    console.log(`server running at http://localhost:${process.env.PORT}`);
})
