const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var userStatus = new Schema({
  status:Number,
  date:Date,
  userId:String
});
const  ActivitySchema = new Schema({
  username: String,
  createdDate: {type: Date, default: Date.now},
  profilUrl:String,
  activityUrl:String,
  isActive:Boolean,
  header:String,
  ownerId:String,
  context:String,
  tagList:[String],
  like:Number,
  participationCount:Number,
  date:Date,
  userList:[userStatus]

},{
    versionKey: false // You should be aware of the outcome after set to false
});
module.exports = mongoose.model("Activity", ActivitySchema);

