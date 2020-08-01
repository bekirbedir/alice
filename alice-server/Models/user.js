const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  Id:String,
  username: String,
  name:String,
  createdDate: String,
  password:String,
  isActive:Boolean,
  role:String,
  tagList:[String],
  email:String,
  phone: String,
  biography: String
});
module.exports = mongoose.model("User", UserSchema);
