const Order = require('../model/orderModel');
const Product = require('../model/productSchema');
const Cart = require('../model/cartModel');
const { default: mongoose } = require('mongoose');
const User = require('../model/UserSchema');
const Category = require('../model/categorySchema');

exports.getOrderDetails=async(req,res)=>{
    let orderId=req.query.id
    // console.log(orderId)
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
    
    res.render("user/order-details", {
      user,
      Categories,
      orders,
      quantityTotal,
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
  console.log(orders)
  res.render('admin/order-detail',{orders})
}