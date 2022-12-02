const mongoose = require("mongoose");
const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLen: [2, "Username must have atleast two letters"],
    maxLen: [20, "Username can not exceed 20 letters"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;
