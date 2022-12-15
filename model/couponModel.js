const mongoose=require('mongoose');
const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      rquired:true
    },
    description: {
      type: String,
      required:true
    },
    percentage: {
      type: Number,
      required: true,
    },
    beginingDate:{
      type:Date
    },
    expireDate:{
      type:Date
    },
    minLimit:{
      type:Number,
      required:true
    },
    maxLimit:{
      type:Number,
      required:true
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;


