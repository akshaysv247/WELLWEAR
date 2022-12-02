const mongoose=require('mongoose') 

const database = process.env.MONGOLAB_URI;
module.exports = mongoose
  .connect(database, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("Mongoose connected"))
  .catch((err) => console.log("mongoose Error",err));
