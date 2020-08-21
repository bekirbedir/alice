const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ActivityCommentSchema = new Schema({
  activityId:String,
  userId: String,
  username:String,
  createdDate: String,
  text:String
});
module.exports = mongoose.model("ActivityComment", ActivityCommentSchema);
