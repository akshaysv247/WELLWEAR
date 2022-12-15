const mongoose = require("mongoose");
const Cart = require("../model/cartModel");
const User = require("../model/UserSchema");
const Product = require("../model/productSchema");
const Category = require("../model/categorySchema");

module.exports = {
  addItemtoCart: async (req, res) => {
    try {
      let productId = req.query.id;
      let userId = req.session.user._id;
      
      const cart = await Cart.findOne({ user: userId });
      const product = await Product.findById(productId);
      //if there is no cart for User
      if (!cart) {
        const newCart = await Cart.create({
          user: userId,
          cartItems: [
            {
              product: productId,
              quantity: 1,
              total:product.price,
            },
          ],
          subTotal: product.price,
        });
        // console.log(newCart)
        if (newCart) {
          return res.json({ status: true });
        }
        //have cart and product is already inside it
      } else if (
        cart &&
        cart.cartItems.some((obj) => obj._id.toString() == productId)
      ) {
        const index = cart.cartItems.findIndex(
          (obj) => obj._id.toString() == productId
        );
        cart.cartItems[index].quantity += 1;
        cart.subTotal += parseInt(product.price);
        // cart.cartItems[index].total += parseInt(product.price * quantity);
        await cart.save();
        return res.json({
          status: "already",
        });
        // User have cart but current product not in cart
      } else {
        cart.cartItems.push({
          product: productId,
          quantity: 1,
          total: product.price,
        });
        cart.subTotal += parseInt(product.price);
        // cart.cartItems[index].total += parseInt(product.price);
        await cart.save().then((response) => {
          // console.log(response)
        });
        return res.json({ status: true });
      }
    } catch (error) {
      console.log(error);
      res.json({
        status: "failed",
        message: "added",
      });
    }
  },

  getCart: async (req, res) => {
    let cart = null;
    const user = req.session.user;

    if (user) {
      cart = await Cart.findOne({ user: req.session.user._id }).populate(
        "cartItems.product"
      );
    }
    let cartData = [];
    if (cart) {
      // console.log(cart.cartItems);
      cartData = cart.cartItems;
    }
    const Categories = await Category.find({});
    res.render("user/cart", { cart, Categories, user, cartData });
  },
  removeCart: async (req, res) => {
    const cart = await Cart.findOne({ user: req.session.user._id });
    let proId = mongoose.Types.ObjectId(req.query.id);
    console.log(proId)
    const index = cart.cartItems.findIndex(
      (obj) => obj._id.toString()== proId
      );
      console.log(index)
      const productId=cart.cartItems[index].product
      const product=await Product.findOne({_id:productId})
      console.log(product)
      price=product.price
    
    let finalAmount = cart.subTotal - cart.cartItems[index].total;
    console.log(finalAmount);
    await Cart.updateOne(
      { user: mongoose.Types.ObjectId(req.session.user._id) },
      {
        $pull: { cartItems: { _id: proId } },
        $set: { subTotal: finalAmount },
      }
    ).then(async(response) => {
      console.log(response);
      const cart=await Cart.findOne({user:req.session.user._id})
      return res.json({ status: true, data: cart.subTotal,cart });
    });
  },
  incrementQuantity:async(req,res)=>{
    let proId=mongoose.Types.ObjectId(req.query.id);
    console.log(proId)
    const cart=await Cart.findOne({user:req.session.user._id})
    const index=cart.cartItems.findIndex((obj)=> obj._id.toString()==proId)
    console.log(index)
    let productId=cart.cartItems[index].product
    const product=await Product.findOne({_id:productId})
    console.log(product)

    let price=product.price
    console.log(price) 
    await Cart.updateOne(
      { "cartItems._id": proId },
      {
        $inc: { "cartItems.$.quantity": 1,"cartItems.$.total":price,"subTotal":price},
      },
      
    ).then(async(response) => {
    const updatedCart=await Cart.findOne({"cartItems.$._id":proId})
      console.log(updatedCart)
      return res.json({
        status: true,
        data: updatedCart,
      });
    });
  },
  decrementQuantity:async(req,res)=>{
    let proId = mongoose.Types.ObjectId(req.query.id);
    console.log(proId);
    const cart = await Cart.findOne({ user: req.session.user._id });
    const index = cart.cartItems.findIndex(
      (obj) => obj._id.toString() == proId
    );
    console.log(index);
    let productId = cart.cartItems[index].product;
    const product = await Product.findOne({ _id: productId });
    console.log(product);

    let price = product.price;
    console.log(price); 
    await Cart.updateOne(
      { "cartItems._id": proId },
      {
        $inc: { "cartItems.$.quantity": -1, "cartItems.$.total": -price ,'subTotal':-price},
      },
      
    ).then(async(response) => {
    const updatedCart = await Cart.findOne({ "cartItems.$._id": proId });
      res.json({
        status: true,
        data: updatedCart,
      });
    });
  }
};
