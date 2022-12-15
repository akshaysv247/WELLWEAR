const Category=require('../model/categorySchema')
const Product=require('../model/productSchema')
const mongoose=require('mongoose')
const User=require('../model/UserSchema')


module.exports={
    getProductByCat:async(req,res)=>{
       let catId=req.query.id
    let products=await Product.find({category:mongoose.Types.ObjectId(catId)})
    console.log(products)
    // let cat =await Product.aggregate([
    //     {
    //         $group:{category:catId}
    //     }
    // ])
    let user=await User.findById(req.session.user._id);
    let Categories=await Category.find({});
    res.render('user/shop2',{products,Categories,user})

    }
}