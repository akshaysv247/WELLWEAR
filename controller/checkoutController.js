const User = require("../model/UserSchema");
const Product = require("../model/productSchema");
const Cart = require("../model/cartModel");
const Category = require("../model/categorySchema");

module.exports = {
  toCheckout: async (req, res) => {
    try {
      if (req.session.user) {
        let user = req.session.user._id;
        console.log(user);
        let cart = await Cart.findOne({
          user: user,
        }).populate("cartItems.product");
        console.log(cart);

        let cartData = cart.cartItems;
        console.log(cartData);
        const Categories = await Category.find();
        res.render("user/checkout", {
          cart,
          cartData,
          Categories,
          user,
        });
      }
    } catch (error) {
      console.log(error);
      res.redirect("/");
    }
  },
};
