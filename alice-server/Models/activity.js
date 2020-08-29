const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ActivityUser = require("../Models/activity-user-status")
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
  status:Number,
  userList:[userStatus],
  actUser: [ActivityUser.schema]
},{
    versionKey: false // You should be aware of the outcome after set to false
});
module.exports = mongoose.model("Activity", ActivitySchema);

