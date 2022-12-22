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
        let cart = await Cart.findOne({
          user: userId,
        }).populate("cartItems.product");

        let cartData = cart.cartItems;
        const Categories = await Category.find();
        const user = await User.findById(req.session.user);
        const userAddress = user.address;
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
    if(!req.body.payment){
      return res.json({coupon : true})
    }
    let addId=mongoose.Types.ObjectId(req.body.group1)
    let placeOrder=req.body.payment==='COD'?'Placed':'Pending';

    let userId = req.session.user._id;

    const user = await User.findById(req.session.user);
    const Categories = await Category.find();
    let cart = await Cart.findOne({
      user: userId,
    }).populate("cartItems.product");
    
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
    let tenDays= new Date(new Date().getTime()+(10*24*60*60*1000));
    let today=Date.now();

      const newOrder=await Order.create({
        userId:mongoose.Types.ObjectId(user),
        paymentMethod:req.body.payment,
        products:cart,
        total:cart.total,
        status:placeOrder,
        deliveryAddress:userAddress,
        purchaseDate:today,
        expectedDeliveryDate:tenDays,

      }).then(async(response)=>{
      let orderId= response._id;
      let totalAmount=response.total

      if(req.body.payment=='COD'){
                  let productInfos = await Cart.aggregate([
                    {
                      $match: {
                        user: mongoose.Types.ObjectId(req.session.user._id),
                      },
                    },
                    {
                      $project: {
                        "cartItems.product": 1,
                        "cartItems.quantity": 1,
                      },
                    },
                    {
                      $unwind:{path:"$cartItems"}
                    }
                  ]);
                  // console.log(productInfos);
                  
                  productInfos.forEach(async(e)=>{
                    // console.log(e.cartItems.quant);
                    let updatedPro = await Product.findByIdAndUpdate(
                      e.cartItems.product,
                      { $inc:{quantity:-e.cartItems.quantity} } ,
                      { new: true }
                    );
                    // console.log(updatedPro);
                  })
        https: await Cart.deleteOne({ user: mongoose.Types.ObjectId(user) });
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
      res.json({status:true,
        generateRazorPay})
      }
      })
    } ,
    verifyPayment:async(req,res)=>{
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
          $set:{status:'Placed'}
        }
        )
          let productInfos = await Cart.aggregate([
            {
              $match: {
                user: mongoose.Types.ObjectId(req.session.user._id),
              },
            },
            {
              $project: {
                "cartItems.product": 1,
                "cartItems.quantity": 1,
              },
            },
            {
              $unwind: { path: "$cartItems" },
            },
          ]);
          console.log(productInfos);

          productInfos.forEach(async (e) => {
            console.log(e.cartItems.quant);
            let updatedPro = await Product.findByIdAndUpdate(
              e.cartItems.product,
              { $inc: { quantity: -e.cartItems.quantity } },
              { new: true }
            );
            // console.log(updatedPro);
          });
          await Cart.deleteOne({ user: mongoose.Types.ObjectId(req.session.user._id) });
             let user = await User.findById(req.session.user._id);
           let Categories = await Category.find();
      res.json({status:true,
      data:
        user,Categories
      })
        
      }
        
    },
    thankYou:async(req,res)=>{
      let user=req.session.user;
      let Categories=await Category.find({});

      res.render('user/thankYou',{user,Categories})
    }
  }


