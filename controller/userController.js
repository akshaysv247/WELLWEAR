const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Cart = require("../model/cartModel");
const Category = require("../model/categorySchema");
const Product = require("../model/productSchema");
const Uses = require("../middleware/userSession");
const User = require("../model/UserSchema");
const Order = require("../model/orderModel");

exports.homePage = async (req, res) => {
  const Categories = await Category.find({});
  const Products = await Product.find({});
  const cart = await Cart.find({});
  res.render("user/index", {
    title: "WEAR WELL",
    Categories,
    Products,
    cart,
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
exports.productDeatails = async (req, res) => {
  let productId = req.query.id;
  // console.log(productId);
  const Products = await Product.findById(productId);
  const product = await Product.find();
  // console.log(Products);
  res.render("user/productDetails", { Products, product });
};
exports.getMyAcc = async (req, res) => {
  if (req.session.user) {
    const user = await User.findById(req.session.user);
    const userAddress = user.address;
    const orders=await Order.find({});
     let quantityTotal = await Order.aggregate([
       {
         $project: {
           products: { $arrayElemAt: ["$products.cartItems", 0] },
           _id: 0,
         },
       },
       { $project: { productsTotal: { $sum: "$products.quantity" } } },
     ]);
    // console.log(orders)
    res.render("user/account", { user, userAddress,orders, quantityTotal});
  } else {
    res.redirect("/");
  }
};
exports.Address =async (req, res) => {
 let user=req.session.user
 let Categories=await Category.find({})
  res.render("user/address",{user,Categories});
};
exports.addAddress = async (req, res) => {
  let message;
  let userId = mongoose.Types.ObjectId(req.session.user._id);
  try {
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.place ||
      !req.body.pinCode ||
      !req.body.houseNo ||
      !req.body.landMark ||
      !req.body.country ||
      !req.body.state ||
      !req.body.Email ||
      !req.body.phone
    ) {
      message = "Fill all the Blanks!";
      res.locals.message = message;
      return res.render("user/address");
    }
    await User.updateOne(
      {
        _id: userId,
      },
      {
        $push: {
          address: [
            {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              place: req.body.place,
              pinCode: req.body.pinCode,
              houseNo: req.body.houseNo,
              landMark: req.body.landMark,
              country: req.body.country,
              state: req.body.state,
              Email: req.body.Email,
              phone: req.body.phone,
            },
          ],
        },
      }
    );
    res.redirect("/myAc");
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};
exports.deleteAddress = async (req, res) => {
  addId = req.query.id;
  let userId = mongoose.Types.ObjectId(req.session.user._id);

  await User.updateOne({
    _id: userId,
  },{
    $pull:{address:{_id:mongoose.Types.ObjectId(addId)}}
  });
  return res.json({
    status:true,
  })
};
exports.getAddressDetails=async(req,res)=>{
  let addId=req.query.id;
  console.log(addId)
  let user=await User.findById(req.session.user)
  // console.log(user)
  let myAddress = await User.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(user) } },
    {
      $project: { address: 1, _id: 0 },
    },
    {
      $unwind: {
        path: "$address",
      },
    },
    { $match: { "address._id": mongoose.Types.ObjectId(addId) } },
  ]);
  console.log(myAddress)
  let addresses=myAddress.$.address
  console.log(this.getAddressDetails)
   let Categories = await Category.find({});

  return res.render('user/address-edit',{addresses,user,Categories})
}
exports.editAddress=async(req,res)=>{
  let addId=req.query.id;
  let userId=req.session.user;
  let data=req.body;
  await User.updateOne(
    {
      _id: userId,
    },
    {
      $set: {
        address: [
          {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            place: req.body.place,
            pinCode: req.body.pinCode,
            houseNo: req.body.houseNo,
            landMark: req.body.landMark,
            country: req.body.country,
            state: req.body.state,
            Email: req.body.Email,
            phone: req.body.phone,
          },
        ],
      },
    }
  );
  res.redirect('/myAc');
}
