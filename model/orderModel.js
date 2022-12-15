const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref:"User",
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  products: {
    type: Array,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  deliveryAddress: {
    type: Object,
    required: true,
  },
  purchaseDate: {
    type: Date,
  },
  expectedDeliveryDate: {
    type: Date,
  },
},
{
  timestamps:true,
}
);

const Order= mongoose.model("order", orderSchema);
module.exports=Order;
