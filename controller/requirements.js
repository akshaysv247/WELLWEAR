const Category = require("../model/categorySchema");
const Product = require("../model/productSchema");
const User = require("../middleware/userSession");

exports.requirements=async(req,res,next)=>{
    Products=await Product.find({})
    Categories=await Category.find({})
    user=req.session.user
    next()
}