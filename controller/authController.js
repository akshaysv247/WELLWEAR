const { response } = require("express");
const bcrypt = require("bcrypt");
const Promise = require("promise");
const mongoose=require('mongoose')
const User = require("../model/UserSchema");
const Admin = require("../model/adminSchema");
const Uses=require('../middleware/userSession')
const Category=require('../model/categorySchema')
const otpAuth = require("../utils/otpAuthentication");

//user registration
let phone
let id
exports.signupUser = async (req, res) => {
  let message;
  try {
    if (
      !req.body.username ||
      !req.body.email ||
      !req.body.password ||
      !req.body.phone ||
      !req.body.conformPassword
    ) {
      message = "Fill all the Fields";
      res.locals.regMessage = message;
      return res.render("user/signup");
    }
    //checking password

    if (req.body.password != req.body.conformPassword) {
      message = `Passwords doesn't match`;
      res.locals.regMessage = message;
      return res.render("user/signup");
    }
    //checking if email is already taken
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      message = "Email already taken";
      res.locals.regMessage = message;
      return res.render("user/signup");
    }
    //hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //creating new user
    await User.create({
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: hashPassword,
      verified : false
    }).then((res)=>{
      id=res._id
    })
    phone=req.body.phone
    otpAuth.sendOtp(req.body.phone);
    res.render('user/otp-validate');
  } catch (err) {
    console.log(err);
    console.log(err.message);
    res.redirect("/signup");
  }
};

//user login
exports.loginUser = async (req, res) => {
  let message;
  // Validation
  try {
    if (!req.body.email || !req.body.password) {
      message = "Fill all the fields";
      res.locals.message = message;
      return res.render("user/user-login");
    }

    // Check if email already taken
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      
      id=user._id;
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if(user.verified==false){
        message="Your account is not verified"
        res.locals.message=message;
        otpAuth.sendOtp(user.phone);
        phone = user.phone;
        res.render("user/otp-validate");
        return res.render('user/user-login')
      }
      if (user.isBlocked) {
        message = "Your account is suspended";
        res.locals.message = message;
        return res.render("user/user-login");
      }
      if (isMatch) {
        // res.locals.user = user;
        req.session.user=user
        req.session.userLoggedIn = true;
        return res.redirect("/");
      } else {
        message = "email or password not correct";
        res.locals.message = message;
        return res.render("user/user-login");
      }
    }
    if (!user) {
      message = "user not found";
      res.locals.message = message;
      return res.render("user/user-login");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/user-login");
  }
};

//admin login
exports.adminLogin = async (req, res) => {
  let message;
  try {
    if (!req.body.email || !req.body.password) {
      message = "Fill all the blanks";
      res.locals.adminMessage = message;
      return res.render("admin/admin-login");
    }
    const admin = await Admin.findOne({ email: req.body.email });
    if (admin) {
      const isMatch = await bcrypt.compare(req.body.password, admin.password);
      if (isMatch) {
        res.locals.admin = admin;
        req.session.adminLoggedIn = true;
        return res.redirect("/admin/admin-home");
      } else {
        message = "email or password did not match";
        res.locals.adminMessage = message;
        return res.render("admin/admin-login");
      }
    }
    if (!admin) {
      message = "admin not found";
      res.locals.adminMessage = message;
      return res.render("admin/admin-login");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/admin/admin-login");
  }
};

exports.getAllUsers = async (req, res) => {
  const userDetails = await User.find();
  res.render("admin/user-list", { userDetails });
};
exports.activeUsers = async (req, res) => {
  id = req.params.id;
  await User.updateOne({ _id: id }, { $set: { isBlocked: false } });
  res.redirect("/admin/user-list");
};
exports.blockedUsers = async (req, res) => {
  id = req.params.id;
  await User.updateOne({ _id: id }, { $set: { isBlocked: true } });
  res.redirect("/admin/user-list");
};
exports.adminLogout = (req, res) => {
  req.session.destroy();
  res.redirect("/admin/admin-login");
};

exports.makeOtp = async(req, res) => {
  let con = req.body;
  console.log(con);
  let otp = con.one
    .concat(con.two)
    .concat(con.three)
    .concat(con.four)
    .concat(con.five)
    .concat(con.six);

  let verify=await otpAuth.verifyOtp(phone,otp)
  if(verify.valid){
    // letUser.updateOne({ _id: id });
    await User.updateOne({_id:id},{$set:{verified:true}});
    req.session.userLoggedIn=true;
    res.redirect('/')
  }
  else{
    res.redirect('/signup')
  }
};
exports.userLogout=(req,res)=>{
  req.session.destroy();
  res.redirect("/");
}

exports.getResestPas=async(req,res)=>{
  const user=await User.findById(mongoose.Types.ObjectId(req.session.user))
  const Categories=await Category.find({})
  res.render('user/forget-password',{user,Categories})
}
exports.sendResetOtp=(req,res)=>{
  phone=req.body.phone;
  console.log(phone)
  otpAuth.sendOtp(phone)
  res.render("user/resetotp-validate");
}
exports.makeResetOtp = async (req, res) => {
  let con = req.body;
  console.log(con);
  let otp = con.one
    .concat(con.two)
    .concat(con.three)
    .concat(con.four)
    .concat(con.five)
    .concat(con.six);

  let verify = await otpAuth.verifyOtp(phone, otp);
  if (verify.valid) {
    // letUser.updateOne({ _id: id });
    await User.updateOne({ _id: id }, { $set: { verified: true } });
    res.render("user/reset-password");
  } else {
    res.redirect("/signup");
  }
};

exports.resetPassword=async(req,res)=>{
  console.log(req.body)
  let phoneNumber=req.body.phone;
  let newPassword=req.body.password;
  let message;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  try {
    if(req.body.password!=req.body.conformPassword){
      message='You have entered different Passwords '
      res.locals.message=message;
      return res.render('user/reset-password')
    }
    if(!req.body.password||!req.body.phone||!req.body.conformPassword){
      message=`Please fill all the Fields`;
      res.locals.message=message;
      return res.render('user/reset-password')
    }
    await User.updateOne(
      { phone: phoneNumber },
      {
        $set: { password: hashedPassword },
      }
    );
    res.redirect("/");
  } catch (error) {
    console.log(error)
  }
}