import mongoose from 'mongoose'


const cartSchema = new mongoose.Schema({
    cartItemTitle: {
        type:String,
        required:true,
    },
    cartItemDescription:{
        type:String,
    },
    cartItemPrice: {
        type:Number,
        required:true,
    },
    cartItemQty:{
        type:Number,
        required:true,
        default:1,
    },
    cartUser: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    cartProductId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
    },
    cartItemImg: {
        type:String,
        required:true,
    }
},{timestamps:true});

export const Cart = mongoose.model('Cart',cartSchema);

