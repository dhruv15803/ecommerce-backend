import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    productId:{
        type:String,
        required:true,
        unique:true,
    },
    productImg:{
        type:String,
        required:true,
    },
    productTitle: {
        type:String,
        required:true,
    },
    productDescription: {
        type:String,
        required:true,
    },
    productPrice: {
        type:Number,
        required:true,
    },
    productStock: {
        type:Number,
        required:true,
    },
    productRating: {
        type:Number,
    },
    category: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    subCategory: {
        type:String,
    }
},{timestamps:true});

export const Product = mongoose.model('Product',productSchema);