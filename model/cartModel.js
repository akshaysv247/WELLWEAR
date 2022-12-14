const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartItems: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        total: {
          type: Number,
        },
      },
    ],
    subTotal: {
      type: Number,
    },
    couponDiscount: {
      type: Number,
    },
    total : {
      type : Number
    }
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
