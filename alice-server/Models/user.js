const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  Id:String,
  username: String,
  name:String,
  createdDate: String,
  updatedDate: String,
  password:String,
  isActive:Boolean,
  role:String,
  tagList:[String],
  email:String,
  phone: String,
  biography: String,
  status: {type: Number, default: 1},
  mailOnayCode: String
});
module.exports = mongoose.model("User", UserSchema);
