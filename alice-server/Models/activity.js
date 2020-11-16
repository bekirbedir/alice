const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ActivityUser = require("../Models/activity-user-status")
const User = require("../Models/user")
const searchable = require('mongoose-regex-search');
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
  header: { type: String, searchable: true },
  ownerId:String,
  context: { type: String, searchable: true },
  tagList:{ type: [String], searchable: true },
  like:Number,
  participationCount:Number,
  participationLimit:Number,
  date:Date,
  status:Number,
  fileLink:String,
  user: {type:Schema.Types.ObjectId, ref: 'User'},
  userList:[userStatus],
  actUser: [ActivityUser.schema]
},{
    versionKey: false // You should be aware of the outcome after set to false
});
ActivitySchema.plugin(searchable);
module.exports = mongoose.model("Activity", ActivitySchema);

/*
1	beklemede
2	reddet
3	onaylandı
4
*/