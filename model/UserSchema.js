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
    // items:[{productId:{type:mongoose.Types.ObjectId, ref:"Product",required:true}}]
    type:Array
  },
  address:{
    type:Array
  }
},
{
  timestamps:true
});
const User = mongoose.model("User", UserSchema);
module.exports = User;

