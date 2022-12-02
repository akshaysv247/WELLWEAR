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
              total: product.price,
            },
          ],
          subTotal: product.price,
        });
        // console.log(newCart)
        if (newCart) {
          return res.redirect(`/product-details?id=${productId}`);
        }
        //have cart and product is already inside it
      } else if (
        cart &&
        cart.cartItems.some((obj) => obj.product.toString() == productId)
      ) {
        const index = cart.cartItems.findIndex(
          (obj) => obj.product.toString() == productId
        );
        cart.cartItems[index].quantity += 1;
        cart.subTotal += parseInt(product.price);
        await cart.save();
        return res.redirect(`/product-details?id=${productId}`);

        // User have cart but current product not in cart
      } else {
        cart.cartItems.push({
          product: productId,
          quantity: 1,
          total: product.price,
        });
        cart.subTotal += parseInt(product.price);
        await cart.save();
        return res.redirect(`/product-details?id=${productId}`);
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({ success: false, msg: error.message });
      // res.render('/')
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
    let cartData=[];
    if (cart) {
      console.log(cart.cartItems);
      cartData = cart.cartItems;
    }
    const Categories = await Category.find({});
    res.render("user/cart", { cart, Categories, user, cartData });
    

  },
  
};
