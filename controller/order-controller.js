const Order = require('../model/orderModel');
const Product = require('../model/productSchema');
const Cart = require('../model/cartModel');
const { default: mongoose } = require('mongoose');
const User = require('../model/UserSchema');
const Category = require('../model/categorySchema');
const { findById, findOne } = require('../model/orderModel');

exports.getOrderDetails=async(req,res)=>{
    let orderId=req.query.id
    let user=await User.findById(req.session.user)
    let Categories=await Category.find({})
    let orders=await Order.findById(mongoose.Types.ObjectId(orderId))
         let quantityTotal = await Order.aggregate([
           {
             $project: {
               products: { $arrayElemAt: ["$products.cartItems", 0] },
               _id: 0,
             },
           },
           { $project: { productsTotal: { $sum: "$products.quantity" } } },
         ]);
   let products = await Order.aggregate([
     { $match: { _id: mongoose.Types.ObjectId(orderId) } },
     {
       $project: {
         items: { $arrayElemAt: ["$products.cartItems", 0] },
         _id: 0,
       },
     },
     {$unwind:{path:'$items'}},
     {$lookup:{
       from:'products',
       localField:'items.product',
       foreignField:'_id',
       as:'product'
     }},
   ]);
   console.log(products)
    res.render("user/order-details", {
      user,
      Categories,
      orders,
      quantityTotal,
      products,
    });
}

exports.cancelOrder=async(req,res)=>{
  let orderId=req.query.id
  console.log(orderId)
  await Order.updateOne(
        {
          _id:mongoose.Types.ObjectId(orderId)
        },
        {
          $set:{status:'Cancelled'}
        }
  )
  res.redirect('/myAc')

}
exports.getOrders=async(req,res)=>{
  let allOrders=await Order.find({});
  // console.log("h",allOrders)
  let quantityItem = await Order.aggregate([
    { $project: { products: { $arrayElemAt: ["$products.cartItems", 0] }, _id: 0 } },
    {$project: {productsTotal: { $sum: "$products.quantity"},}
   }
  ]);
  let userDet=await Order.find({}).populate('userId').lean()

  // console.log(userDet[0].userId.username)
  
   res.locals.userDet = userDet;
  res.render("admin/new-order", { allOrders, quantityItem });  
}
exports.cancelOrderAsAdmin=async(req,res)=>{
  let orderId=req.query.id;
  // console.log(orderId)
  await Order.updateOne(
  {
    _id:mongoose.Types.ObjectId(orderId)
  },
  {
    $set:{status:'Cancelled'}
  }
  ).then(async(response)=>{
    console.log(response);
    let order=await Order.findOne({_id:mongoose.Types.ObjectId(orderId)})
    console.log(order)

    res.json({status:true,data: order})
  })
}
exports.viewOrderDeatails=async(req,res)=>{
  let orderId=req.query.id;
  let orders=await Order.findOne({_id:mongoose.Types.ObjectId(orderId)});
  // console.log(orders)
  let user=await User.findById(mongoose.Types.ObjectId(orders.userId))
  // console.log(user)
  let aDDress = await Order.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(orderId) },
    },
    {
    $project: {
           addresses: { $arrayElemAt: ["$deliveryAddress.address", 0] },
           _id: 0,
         },
    },
    {
      $unwind:{path:"$addresses"}
    }
  ]);
  // console.log(aDDress)

     let products = await Order.aggregate([
       { $match: { _id: mongoose.Types.ObjectId(orderId) } },
       {
         $project: {
           items: { $arrayElemAt: ["$products.cartItems", 0] },
           _id: 0,
         },
       },
       { $unwind: { path: "$items" } },
       {
         $lookup: {
           from: "products",
           localField: "items.product",
           foreignField: "_id",
           as: "productDet",
         },
       },
     ]);

     let totalQuant = await Order.aggregate([
       {
         $project: {
           products: { $arrayElemAt: ["$products.cartItems", 0] },
           _id: 0,
         },
       },
       { $project: { productsTotal: { $sum: "$products.quantity" } } },
     ]);

     res.locals.orders=orders;
     res.locals.user=user;
     res.locals.totalQuant=totalQuant;
     res.locals.aDDress=aDDress;
  res.render("admin/order-detail", {
    products,
  });
}
exports.updateStatus=async(req,res)=>{
  console.log(req.body)
  let newStat=req.body.status;
  let orderId=req.query.id
  console.log(orderId,newStat)
  let updatedStatus=await Order.updateOne(
  {
    _id:mongoose.Types.ObjectId(orderId)
  },
  {
    $set:{status:newStat}
  }
  )
  res.json({ status: true, data: newStat });

}