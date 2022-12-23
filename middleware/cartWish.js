const mongoose = require("mongoose");
const Cart = require("../model/cartModel");
const User = require("../model/UserSchema");

module.exports = {
  counts: async (req, res, next) => {
    let userId = req.session.user._id;
    let user = await User.findOne({ _id: mongoose.Types.ObjectId(userId) });
    let cart = await Cart.findOne({ user: mongoose.Types.ObjectId(userId) });
    let wishLength = user.wishlist.length;
    let cartLength;
    if (cart) {
      cartLength = cart.cartItems.length;
    } else {
      cartLength = 0;
    }
    req.session.cartLength = cartLength;
    req.session.wishLength = wishLength;
    next();
  },
};
