const Category = require("../model/categorySchema");
const Product = require("../model/productSchema");
const User = require("../middleware/userSession");
const Cart = require("../model/cartModel");

exports.requirements = async (req, res, next) => {
  res.locals.Products = await Product.find({});
  res.locals.Categories = await Category.find({});
  res.locals.user = req.session.user;
  res.locals.Cart = await Cart.find({});
  next();
};
