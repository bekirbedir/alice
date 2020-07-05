const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  Id:String,
  username: String,
  createdDate: String,
  password:String,
  isActive:Boolean,
  role:String
});
module.exports = mongoose.model("User", UserSchema);
