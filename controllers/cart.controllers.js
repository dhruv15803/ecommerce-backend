import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Cart } from "../models/cart.models.js";
dotenv.config({
  path: "../.env",
});

const addToCart = async (req, res) => {
  try {
    const {cartItemTitle,cartItemDescription,cartItemPrice,cartProductId,cartItemImg} =
      req.body;
    let { cartItemQty } = req.body;
    console.log(req.body);
    if (!req.cookies?.accessToken) {
      res.status(400).json({
        success: false,
        message: "not logged in",
      });
      return;
    }
    const decodedToken = jwt.verify(
      req.cookies?.accessToken,
      process.env.JWT_SECRET
    );

    if (!decodedToken) {
      res.status(400).json({
        success: false,
        message: "something went wrong",
      });
      return;
    }

    // checking if the product is already in cart,
    const isCart = await Cart.findOne({ cartProductId: cartProductId });
    if (isCart) {
      const cartItem = await Cart.updateOne(
        { cartProductId },
        { $set: { cartItemQty: isCart.cartItemQty + 1 } }
      );
      console.log(cartItem);
      res.json({
        success: true,
        message: "item quantity updated",
      });
    } else {
      const cartItem = await Cart.create({
        cartItemTitle,
        cartItemDescription,
        cartItemPrice,
        cartItemQty,
        cartProductId,
        cartItemImg,
        cartUser: decodedToken._id,
      });
      res.status(201).json({
        success: true,
        message: "successfully added to cart",
        cartItem,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong with the server",
    });
    console.log(error);
  }
};

const getUserCartItems = async (req, res) => {
  try {
    if (!req.cookies?.accessToken) {
      res.status(400).json({
        success: false,
        message: "not logged in",
      });
      return;
    }
    const decodedToken = jwt.verify(
      req.cookies?.accessToken,
      process.env.JWT_SECRET
    );
    const cartItems = await Cart.find({ cartUser: decodedToken?._id });
    res.status(200).json({
      success: true,
      cartItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
    console.log(error);
  }
};

const clearCart = async (req, res) => {
  try {
    if (!req.cookies?.accessToken) {
      res.status(400).json({
        success: false,
        message: "not logged in",
      });
      return;
    }
    const decodedToken = jwt.verify(
      req.cookies?.accessToken,
      process.env.JWT_SECRET
    );
    await Cart.deleteMany({ cartUser: decodedToken._id });
    res.status(200).json({
      success: true,
      message: "successfully cleared user cart",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong when clearing the cart",
    });
    console.log(error);
  }
};

const incrementQty = async (req,res) => {
  try {
    const { _id } = req.body;
    const cartItem = await Cart.findOne({ _id });
    console.log(cartItem);
    if (!cartItem) {
      res.status(400).json({
        success: false,
        message: "something went wrong",
      });
      return;
    }
    await Cart.updateOne({_id},{$set: {cartItemQty: cartItem.cartItemQty + 1 }});
    res.json({
      success: true,
      message: "successfully incremented quantity",
    });
  } catch (error) {
    console.log(error);
  }
};



const decrementQty = async (req,res) => {
    try {
      const { _id } = req.body;
      const cartItem = await Cart.findOne({ _id });
      if (!cartItem) {
        res.status(400).json({
          success: false,
          message: "something went wrong",
        });
        return;
      }
      await Cart.updateOne({_id},{$set: { cartItemQty: cartItem.cartItemQty - 1 }});
      res.json({
        success: true,
        message: "successfully decremented quantity",
      });
    } catch (error) {
      console.log(error);
    }
  };


  const deleteCartItem = async (req,res)=>{
        try {
            const {_id} = req.body;
            await Cart.deleteOne({_id});
            res.status(200).json({
                "success":true,
                "message":"successfully deleted cart item"
            })
        } catch (error) {
            res.status(500).json({
                "success":false,
                "message":"something went wrong when deleting cart item"
            })
            console.log(error);
        }
  }

  const getTotalPrice = async (req,res)=>{
try {
        if(!req.cookies?.accessToken){
            res.status(400).json({
                "success":false,
                "message":"user not logged in"
            })
            return;
        }
        const decodedToken = jwt.verify(req.cookies?.accessToken,process.env.JWT_SECRET);
        let sum = 0;
        const items = await Cart.find({cartUser:decodedToken._id});
        for(let i = 0 ;i<items.length;i++){
            sum+=items[i].cartItemPrice * items[i].cartItemQty;
        }
        res.status(200).json({
            "success":true,
            "totalPrice":sum,
        })
} catch (error) {
    console.log(error);
  }
}



export { addToCart, getUserCartItems, clearCart ,incrementQty,decrementQty,deleteCartItem,getTotalPrice};
