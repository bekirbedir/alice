const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const  ActivityViewSchema = new Schema({
  Id:Number,
  username: String,
  createdDate: {type: Date, default: Date.now},
  profilUrl:String,
  activityUrl:String,
  isActive:Boolean,
  header:String,
  context:String,
  tagList:[String],
  like:Number,
  participationCount:Number,
  date:Date

},{
    versionKey: false // You should be aware of the outcome after set to false
});
module.exports = mongoose.model("ActivityView", ActivityViewSchema);
