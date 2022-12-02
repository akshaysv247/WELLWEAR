const mongoose=require('mongoose')
const categorySchema=new mongoose.Schema({

     catName:{
        type:String,
        require:true,
     },
     thumbnail:{
        type:String,
        required:true,
     },
},
{
    timestamps:true,
})
const Category=mongoose.model('Category',categorySchema);
module.exports=Category;