const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  Id:String,
  userName: String,
  createDate: String,
  isActive:Boolean
});
module.exports = mongoose.model("User", UserSchema);
