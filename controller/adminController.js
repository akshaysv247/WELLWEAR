const express = require("express");
const { session } = require("passport");
const { CpsContext } = require("twilio/lib/rest/preview/trusted_comms/cps");
const Category = require("../model/categorySchema");
const router = express.Router();
const Order = require("../model/orderModel");
const Product = require("../model/productSchema");
const User = require("../model/UserSchema");
const moment=require('moment');

exports.loginPage = (req, res) => {
  if (req.session.adminLoggedIn) {
    res.render("admin/admin-index");
  } else {
    res.render("admin/admin-login");
  }
};
exports.adminLog = (req, res) => {
  res.redirect("/admin/admin-login");
};
exports.indexPage = async (req, res) => {
  const allOrders = await Order.find({});
  let quantityItem = await Order.aggregate([
    {
      $project: {
        products: { $arrayElemAt: ["$products.cartItems", 0] },
        _id: 0,
      },
    },
    { $project: { productsTotal: { $sum: "$products.quantity" } } },
  ])
  let userDet = await Order.find({}).populate("userId").lean();
  let Products = await Product.find({});
  let users = await User.find({});
  let completedStatus = await Order.find({ status: "Delivered" }).count();
  console.log(completedStatus);
  let cancelledStatus = await Order.find({ status: "Cancelled" }).count();
  console.log(cancelledStatus);
  let placedStatus = await Order.find({ status: "Placed" }).count();
  console.log(placedStatus);
  let onDelivery = await Order.find({ status: "On Delivery" }).count();
  console.log(onDelivery);
    let pending = await Order.find({ status: "Pending" }).count();
    console.log(pending);
const orderStatus = [
  completedStatus,
  placedStatus,
  onDelivery,
  cancelledStatus,
  pending,
];

let OneWeekBefore = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
let oneMonth = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000); 
let toDay=Date.now()
let weekRevenue = await Order.aggregate([
  {
    $match: { purchaseDate:{$gt:OneWeekBefore} },
  },
  {
    $project:{'purchaseDate':1,'total':1}
  },
  {
    $group:{
      _id:{$dateToString: { format: "%Y-%m-%d", date:'$purchaseDate'}},
      totalAmount:{$sum:'$total'},
      count:{$sum:1}
    
  }
}
]).sort({_id:1})

let revenueDate=[]
let revenueAmount=[]
let countOrder=[]

weekRevenue.forEach((e)=>{
  revenueDate.push(e._id)
  revenueAmount.push(e.totalAmount)
  countOrder.push(e.count)
});

console.log(weekRevenue);
  res.render("admin/admin-index", {
    allOrders,
    userDet,
    quantityItem,
    users,
    Products,
    orderStatus,
    revenueDate,
    revenueAmount,
    countOrder
  });
};

exports.userProfile = (req, res) => {
  res.render("admin/user-profile");
};
exports.proList = (req, res) => {
  res.redirect("/admin/product-list");
};
exports.addProd = async (req, res) => {
  const Categories = await Category.find({});
  res.render("admin/product-add", { Categories });
};
exports.gridProduct = (req, res) => {
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

exports.addNewBanner = (req, res) => {
  res.render("admin/addBanner");
};
