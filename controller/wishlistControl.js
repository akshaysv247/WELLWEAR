const mongoose = require("mongoose");
const User = require("../model/UserSchema");
const Products = require("../model/productSchema");

module.exports = {
  addToWishlist: async (req, res) => {
      let productId =req.query.id;
    let userId = mongoose.Types.ObjectId(req.session.user._id);
    const existProduct = await User.findOne({
      _id: userId,
      wishlist: mongoose.Types.ObjectId(productId),
    });
    if (existProduct == null) {
      await User.updateOne(
        { _id: mongoose.Types.ObjectId(req.session.user._id) },
        { $push: { wishlist: mongoose.Types.ObjectId(productId) } }
      ).then((response)=>{
       return res.json({
          status: true,
        });
      });
      
    } else {
      await User.updateOne(
        { _id: mongoose.Types.ObjectId(req.session.user._id) },
        {
          $pull: { wishlist: mongoose.Types.ObjectId(productId) },
        }
      ).then((response)=>{
        return res.json({
          status:true,
        })
      })
    }
  },
  getWishlist: async (req, res) => {
    let user = req.session.user;
    try {
        if(user){
            if (user.wishlist == null) {
              res.render("user/wishlist", { products: false });
            } else {
              User.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(user._id) } },
                {
                  $project: {
                    wishlist: 1,
                  },
                },
                {
                  $unwind: {
                    path: "$wishlist",
                  },
                },
              
                {
                  $lookup: {
                    from: "products",
                    localField: "wishlist",
                    foreignField: "_id",
                    as: "Product",
                  },
                },
                {
                  $project: {
                    wishlist: 1,
                    Product: { $arrayElemAt: ["$Product", 0] },
                  },
                },
              ]).then((products) => {
                res.render("user/wishlist", { products, user });
              });
            }
        }else{
            res.redirect("/user-login");
        }
      
    } catch (error) {
      console.log(error);
      res.redirect("/");
    }
  },
  deleteWish: async (req, res) => {
  
      console.log(req.query.id);
    let productId = mongoose.Types.ObjectId(req.query.id);
    let userId= req.session.user._id;
    await User.updateOne(
      { _id:mongoose.Types.ObjectId(userId)},
      {
        $pull: { wishlist: productId },
      }
    );
    return res.json({
      status:true,

    });
  },
};
