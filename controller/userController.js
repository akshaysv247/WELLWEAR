const express = require("express");
const router = express.Router();
const Category = require("../model/categorySchema");
const Product = require("../model/productSchema");
const Uses = require("../middleware/userSession");
const User = require("../model/UserSchema");

exports.homePage = async (req, res) => {
  const Categories = await Category.find({});
  const Products = await Product.find({});
  res.render("user/index", {
    title: "WEAR WELL",
    Categories,
    Products,
    user: req.session.user,
  });
};
exports.Home = (req, res) => {
  res.redirect("/");
};
exports.userSignup = (req, res) => {
  res.render("user/signup");
};
exports.userLogin = (req, res) => {
  res.render("user/user-login");
};
exports.shopPage = async (req, res) => {
  const Categories = await Category.find({});
  const Products = await Product.find({}).populate("category");
  res.render("user/shop", {
    Products,
    Categories,
    user: req.session.user,
  });
};
exports.contactPage = (req, res) => {
  res.render("user/contact");
};

exports.registerUser = (req, res) => {
  res.redirect("/");
};
exports.productDeatails=async(req,res)=>{
  let productId=req.query.id
  console.log(productId)
  const Products=await Product.findById(productId)
  console.log(Products)
  res.render('user/productDetails',{Products})
}
exports.getMyAcc=async(req,res)=>{
  if(req.session.user){
    const user = await User.findById(req.session.user);
    res.render("user/account", { user });
  }else{
    res.redirect('/')
  }
}
