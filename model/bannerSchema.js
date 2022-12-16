const mongoose=require('mongoose');
const bannerSchema=new mongoose.Schema(
    {
        thumbnail:{
            type:String,
            required:true
        },
        description:{
            type:String,
        },

    }
)
const Banner=mongoose.model('Banner',bannerSchema);
module.exports=Banner;