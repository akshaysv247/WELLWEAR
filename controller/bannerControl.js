const mongoose=require('mongoose')
const Banner=require('../model/bannerSchema');

exports.addBanners=async(req,res)=>{
    let bannerData=req.body
    console.log(bannerData)
    let message;
    try {
        if (!bannerData.thumbnail || !bannerData.description) {
          (message = "Please fill all the fields"),
            (res.locals.message = message);
          return res.render("admin/addBanner");
        }else{
          await Banner.create({
            description:bannerData.description,
            thumbnail:bannerData.thumbnail
          })
          return res.redirect("/admin/view-banners");
        }

    } catch (error) {
        console.log(error)
    }
}
exports.getBanners=async(req,res)=>{
  let banners=await Banner.find({})
  // console.log(banners)
  res.render('admin/myBanners',{banners})
}

exports.deleteBanners=async(req,res)=>{
  let bId=req.query.id;
  // console.log(bId)
  await Banner.deleteOne({_id:mongoose.Types.ObjectId(bId)})
  res.json({status:true})
}