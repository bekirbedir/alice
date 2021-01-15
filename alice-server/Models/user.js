const mongoose = require("mongoose");
var random = require('mongoose-simple-random');
const searchable = require('mongoose-regex-search');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  Id:String,
  username: { type: String, searchable: true },
  name:{ type: String, searchable: true },
  createdDate: String,
  updatedDate: String,
  password:String,
  isActive:Boolean,
  role:String,
  resetPasswordCode:String,
  tagList:{ type: [String], searchable: true },
  email:String,
  phone: String,
  biography: { type: String, searchable: true },
  status: {type: Number, default: 1},
  mailOnayCode: String,
  userPhoto:String,
  fileLink:String,
  gender:String,
  birthDate:Date,
  oneSignalId:String

});
UserSchema.plugin(random);
UserSchema.plugin(searchable);
module.exports = mongoose.model("User", UserSchema);
/*
1	mail onay bekliyor
2	adminin onayını bekliyor
3	onaylandı
4	reddedildi
*/