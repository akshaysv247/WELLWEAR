const mongoose=require('mongoose')
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required:true
    },
    image: {
      type: [String],
    },
    size: {
      type: [String],
    },
    description: {
      type: String,
      required: true,
    },
    moreDetails: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    group_tag: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Product=mongoose.model("Product",productSchema)
module.exports=Product;