import { Product } from "../models/product.models.js";
import { nanoid } from "nanoid";
import {v2 as cloudinary} from 'cloudinary';


cloudinary.config({ 
    cloud_name: 'dqcptinzd', 
    api_key: '792156251912376', 
    api_secret: 'jkxJ8U74dhrEtqWczC3_aTczQrw' 
  });


  
const getProductsByCategory = async (req,res)=>{
try {
        const {category} = req.query;
        const products = await Product.find({category})
        res.json({
            "success":true,
            products,
        })
} catch (error) {
    console.log(error);
}
}

const getProductById = async (req,res)=>{
try {
        const {id} = req.params;
        const product = await Product.findOne({productId:id});
        if(!product){
            res.json({
                "success":false,
                "message":"please give valid id"
            })
            return;
        }
        res.json({
            "success":true,
            product,
        })
} catch (error) {
    console.log(error);
}
}


// admin controller
const addProduct = async (req,res)=>{
    try {
        const {productTitle,productDescription,productPrice,productStock,productCategory} = req.body;
        const productThumbnail = req.file;
        
        const response = await cloudinary.uploader.upload(productThumbnail.path,{
            "resource_type":"auto"
        })
        console.log(response.url);
        const product = await Product.create({productId:nanoid(),productTitle,productDescription,productPrice,productStock,category:productCategory,productImg:response.url});  
        res.status(201).json({
            "success":true,
            "message":"product added",
            product,
        }) 
    } catch (error) {
        console.log(error);
    }
}

const editProduct = async (req,res)=>{
try {
        const {newProductTitle,newProductDescription,newProductPrice,newProductStock,newProductCategory,productId} = req.body; 
        const newProductThumbnail = req.file.path;
        const response = await cloudinary.uploader.upload(newProductThumbnail,{
            "resource_type":"auto"
        })
        const newProduct = await Product.updateOne({productId},{$set:{productTitle:newProductTitle,productDescription:newProductDescription,productPrice:newProductPrice,productStock:newProductStock,productCategory:newProductCategory,productImg:response.url}});
        console.log(newProduct);
        res.json({
            "success":true,
            "message":"product successfully updated"
        })
} catch (error) {
    console.log(error);
}
}


const getAllProducts = async (req,res)=>{
try {
        const products = await Product.find({});
        res.json({
            "success":true,
            products,
        })
} catch (error) {
    console.log(error);
}
}





export {addProduct,getAllProducts,editProduct,getProductsByCategory,getProductById};    