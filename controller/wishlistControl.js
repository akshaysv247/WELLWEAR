const mongoose=require('mongoose')
const User=require('../model/UserSchema')
const Products=require('../model/productSchema')

module.exports={
    addToWishlist:async(req,res)=>{
        console.log(req.query.id);
        productId=req.query.id
        userId=mongoose.Types.ObjectId(req.session.user._id);
        const existProduct= await User.findOne({_id:userId,
        wishlist:mongoose.Types.ObjectId(productId)
        });
        console.log(existProduct)
        if(existProduct==null){
            await User.updateOne(
                {_id: mongoose.Types.ObjectId(req.session.user._id)},
                {$push: {wishlist: mongoose.Types.ObjectId(productId)}}
                
            )
            // res.redirect('/shop')
        }else{
            await User.updateOne(
                {_id: mongoose.Types.ObjectId(req.session.user._id)},
                {
                    $pull:{wishlist:mongoose.Types.ObjectId(productId)}
                }
            );
        }

    },
    getWishlist:async(req,res)=>{

        let user=req.session.user
        try {
            if (user.wishlist == null) {
              res.render("user/wishlist", { products: false });
            } else {
              let products = [];
              for (let i = 0; i < user.wishlist.length; i++) {
                let product = await Products.findOne({ _id: user.wishlist[i] });
                products.push(product);
              }
              console.log("wishlist",products);
              res.render("user/wishlist", { products, user });
            }
        
        } catch (error) {
            console.log(error)
            res.redirect('/')
        }
        
    },
    deleteWish:async(req,res)=>{
        productId=req.query.id
        await User.updateOne(
          { _id: mongoose.Types.ObjectId(req.session.user._id) },
          {
            $pull: { wishlist: mongoose.Types.ObjectId(productId) },
          }
        );
        res.redirect('/wishlist')
    }
}