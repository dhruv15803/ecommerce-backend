import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose'
import { editAvatar, editPassword, editUsername, getLoggedIn, loginUser, logoutUser, registerUser } from './controllers/user.controllers.js';
import fs from 'fs';
import multer from 'multer'
import { addProduct, deleteAllProducts, deleteProduct, editProduct, getAllProducts, getProductById, getProductsByCategory, getProductsByCategory2 } from './controllers/product.controller.js';
import cors from 'cors'
import { addCategory, addSubCategory, clearAllSubCategories, deleteAllCategories, deleteCategory, deleteSubCategory, getAllCategories, getCategory, getSubCategory} from './controllers/category.controllers.js';
import { addToCart, clearCart, decrementQty, deleteCartItem, getTotalPrice, getUserCartItems, incrementQty } from './controllers/cart.controllers.js';
dotenv.config({
    path:'./.env'
})
export const adminUser = {
    username:'admin123',
    email: 'admin@gmail.com',
    password:process.env.ADMIN_PASSWORD,
}

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
app.post('/product/add',upload.single('productImg'),addProduct);
app.get('/product/getAll',getAllProducts);
app.put('/product/editProduct',upload.single('newProductImg'),editProduct);
app.get('/product/:category',getProductsByCategory);
app.post('/product/getProductById',getProductById);
app.delete('/product/deleteAll',deleteAllProducts);
app.post('/product/delete',deleteProduct);
app.post('/product/getProductsByCategory',getProductsByCategory2);

// CATEGORY ROUTES
app.post('/category/add',addCategory);
app.get('/category/getAll',getAllCategories);
app.post('/category/delete',deleteCategory);
app.delete('/category/deleteAll',deleteAllCategories);
app.post('/category/getCategory',getCategory);
app.post('/category/addSubCategory',addSubCategory);
app.post('/category/getSubCategory',getSubCategory);
app.post('/category/deleteSubCategory',deleteSubCategory);
app.post('/category/clearAllSubCategories',clearAllSubCategories);

// Cart routes
app.post('/cart/add',addToCart);
app.get('/cart/getItems',getUserCartItems);
app.delete('/cart/clear',clearCart);
app.patch('/cart/increment',incrementQty);
app.patch('/cart/decrement',decrementQty);
app.post('/cart/delete',deleteCartItem);
app.get('/cart/getTotalPrice',getTotalPrice);

app.listen(process.env.PORT,()=>{
    console.log(`server running at http://localhost:${process.env.PORT}`);
})

