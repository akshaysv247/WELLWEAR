const mongoose = require("mongoose");
const Coupon = require("../model/couponModel");
const User=require('../model/UserSchema')
const Category=require('../model/categorySchema')

exports.showCoupons = async (req, res) => {
    let coupon=await Coupon.find({});
    let user = await User.findById(req.session.user._id);
    let Categories=await Category.find({});
  res.render("user/myCoupons",{coupon,Categories,user});
};

//adminSide
exports.addCoupon = (req, res) => {
  res.render("admin/add-coupon");
};
exports.addNewCoupon = async (req, res) => {
  let formData = req.body;
  // console.log(formData);
  let today = Date.now();
  let message;
  if (
    !formData.name ||
    !formData.code ||
    !formData.description ||
    !formData.percentage ||
    !formData.maxLimit ||
    !formData.minLimit ||
    !formData.expireDate
  ) {
    message = "Please fill all the fields";
    res.locals.message = message;
    return res.render("admin/add-coupon");
  }
  else{
      let coupons = await Coupon.create({
        name: formData.name,
        code: formData.code,
        description: formData.description,
        percentage: parseInt(formData.percentage),
        maxLimit: parseInt(formData.maxLimit),
        minLimit: parseInt(formData.minLimit),
        beginingDate: today,
        expireDate: formData.expireDate,
      });
      res.redirect("/admin/add-coupon");
  }

};
exports.viewCoupon=async(req,res)=>{
   let coupons = await Coupon.find({}).sort({ _id: -1 });
  //  console.log(coupons)
   res.render('admin/couponList',{coupons})
}
exports.deleteCoupon=async(req,res)=>{
    let couponId=req.query.id;
    // console.log(couponId)
    await Coupon.deleteOne({_id:mongoose.Types.ObjectId(couponId)})
    res.redirect('/admin/coupon-list')
}
exports.checkCoupon=async(req,res)=>{
  let couponCode=req.body.coupon;
  console.log(couponCode)
  let coupon=await Coupon.findOne({code:couponCode});
  console.log(coupon)
  if(coupon){
    res.json({coupon})
  }
  else if(!coupon){
    res.json({status:true,message:'Please enter the coupon code before applying'})
  }
  else{
    res.json({ message: "you entered invalid coupon code..!" });
  }
}