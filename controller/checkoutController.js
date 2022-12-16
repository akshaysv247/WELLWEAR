const User = require("../model/UserSchema");
const Product = require("../model/productSchema");
const Cart = require("../model/cartModel");
const Category = require("../model/categorySchema");
const Order=require('../model/orderModel')
const { default: mongoose } = require("mongoose");
const Razorpay = require("razorpay");
const crypto=require('crypto')

let instance = new Razorpay({
  key_id: "rzp_test_rAL7bCYJfomjUh",
  key_secret: "driVgMNwZ4odZF0XwGiLzUzC",
});


module.exports = {
  toCheckout: async (req, res) => {
    try {
      if (req.session.user) {
        let userId = req.session.user._id;
        // console.log(userId);
        let cart = await Cart.findOne({
          user: userId,
        }).populate("cartItems.product");
        // console.log(cart);

        let cartData = cart.cartItems;
        // console.log(cartData);
        const Categories = await Category.find();
        const user = await User.findById(req.session.user);
        const userAddress = user.address;
        // console.log(userAddress)
        res.render("user/checkout", {
          cart,
          cartData,
          Categories,
          user,
          userAddress,
        });
      }
    } catch (error) {
      console.log(error);
      res.redirect("/");
    }
  },

  checkingOut: async (req, res) => {
    console.log("fdlkkajfd",req.body);
    if(!req.body.payment){
      return res.json({coupon : true})
    }
    let addId=mongoose.Types.ObjectId(req.body.group1)
    // console.log(addId)
    let placeOrder=req.body.payment==='COD'?'placed':'pending';

    let userId = req.session.user._id;

    const user = await User.findById(req.session.user);
    const Categories = await Category.find();
    let cart = await Cart.findOne({
      user: userId,
    }).populate("cartItems.product");
    // console.log(cart)
    
    let userAddress = await User.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(user) } },
      {
        $project: { address: 1, _id: 0 },
      },
      {
        $unwind: {
          path: "$address",
        },
      },
      { $match: { 'address._id': addId } },
    ]);
    console.log(userAddress)
    let tenDays= new Date(new Date().getTime()+(10*24*60*60*1000));
    let today=Date.now();
    // console.log(today)
    // console.log(tenDays)

      const newOrder=await Order.create({
        userId:mongoose.Types.ObjectId(user),
        paymentMethod:req.body.payment,
        products:cart,
        total:cart.subTotal,
        status:placeOrder,
        deliveryAddress:userAddress,
        purchaseDate:today,
        expectedDeliveryDate:tenDays,

      }).then(async(response)=>{
        console.log(response)
      let orderId= response._id;
      let totalAmount=response.total
      // console.log(orderId,totalAmount)
      if(req.body.payment=='COD'){

       await Cart.deleteOne({user:mongoose.Types.ObjectId(user)})
      // res.render("user/thankYou", { user, Categories,cart });
      res.json({status:true,
      data:user,Categories,cart})

    }else {
    
    const generateRazorPay=await instance.orders.create({
  amount: totalAmount*100,
  currency: "INR",
  receipt: ""+orderId,
  notes: {
    key1: "value3",
    key2: "value2"
  }
})
      //  console.log(generateRazorPay)
      res.json({status:true,
        generateRazorPay})
      }
      })
    } ,
    verifyPayment:async(req,res)=>{
      console.log(req.body)
      const paymentId=req.body.payment['razorpay_payment_id'];
      const orderId=req.body.payment['razorpay_order_id'];
      const signature=req.body.payment['razorpay_signature'];
      const orederedId=req.body.order['receipt'];

      let hmac = crypto.createHmac("sha256", "driVgMNwZ4odZF0XwGiLzUzC");
      hmac.update(orderId+'|'+paymentId);
      hmac=hmac.digest('hex');
      if(hmac==signature){
        await Order.updateOne(
        {
          _id:mongoose.Types.ObjectId(orederedId)
        },
        {
          $set:{status:'placed'}
        }
        ).then(async(response)=>{
          console.log("hjkhkjhkjhjkhkjhkjhkjhkjhk",response)
          await Cart.deleteOne({ user: mongoose.Types.ObjectId(req.session.user._id) });
             let user = await User.findById(req.session.user._id);
           let Categories = await Category.find();
      res.json({status:true,
      data:
        user,Categories
      })
        })
      }
        
    },
    thankYou:async(req,res)=>{
      let user=req.session.user;
      let Categories=await Category.find({});

      res.render('user/thankYou',{user,Categories})
    }
  }


