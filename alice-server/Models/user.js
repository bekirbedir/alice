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
  resetPasswordCode:String,
  tagList:[String],
  email:String,
  phone: String,
  biography: String,
  status: {type: Number, default: 1},
  mailOnayCode: String,
  userPhoto:String,
  fileLink:String
});
module.exports = mongoose.model("User", UserSchema);
/*
1	mail onay bekliyor
2	adminin onayını bekliyor
3	onaylandı
4	reddedildi
*/