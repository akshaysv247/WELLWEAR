const express = require("express");
const { session } = require("passport");
const Category = require("../model/categorySchema");
const router = express.Router();



exports.loginPage=(req,res)=>{
  if(req.session.adminLoggedIn){
    res.render('admin/admin-index')
  }else{
      res.render("admin/admin-login");

  }
}
exports.adminLog = (req, res) => {
  res.redirect('/admin/admin-login')
};
exports.indexPage=(req, res) => {
  res.render("admin/admin-index");
};



exports.userProfile= (req, res) => {
  res.render("admin/user-profile");
};
exports.proList = (req, res) => {
  res.redirect("/admin/product-list");
};
exports.addProd= async(req, res) => {
  const Categories=await Category.find({}) 
  res.render("admin/product-add", { Categories });
};
exports.gridProduct=(req, res) => {
  res.render("admin/product-grid");
};
exports.proDetails = (req, res) => {
  res.render("admin/product-detail");
};

exports.category = (req, res) => {
  res.render("admin/main-category");
};
exports.subCategory = (req, res) => {
  res.render("admin/sub-category");
};



