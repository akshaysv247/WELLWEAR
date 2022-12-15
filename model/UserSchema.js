const mongoose = require("mongoose");
const { interpolators } = require("sharp");
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLen: [2, "Username must have atleast two letters"],
    maxLen: [20, "Username can not exceed 20 letters"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone:{
    type:Number,
    required:true
  },
  isBlocked:{
    type:Boolean,
    default:false,
  },
  verified:{
    type:Boolean,
    default:false,
  },
  wishlist:{
    type:Array
  },
  address:[
    {
      firstName:{type:String},
      lastName:{type:String},
      place:{type:String},
      pinCode:{type:Number,maxLen:6},
      houseNo:{type:String},
      landMark:{type:String},
      country:{type:String},
      state:{type:String},
      Email:{type:String},

      phone:{type:String,maxLen:10}    }
  ],
  couponId: {
    type: mongoose.Types.ObjectId,
    ref:"Coupon",
    required: true,
  },
},
{
  timestamps:true
});
const User = mongoose.model("User", UserSchema);
module.exports = User;

