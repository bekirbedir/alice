const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user")
const Activity = require("./activity")
/*var userStatus = new Schema({
  status:Number,
  date:Date,
  userId:String
}); */
const  NotificationSchema = new Schema({
  activeUserId: String,
  type: Number,
  userId: String,
  activityId: String,
  createdDate: {type: Date, default: Date.now},
  isShow: {type:Boolean , default:false},
  user: {type:Schema.Types.ObjectId, ref: 'User'},
  activity: {type:Schema.Types.ObjectId , ref: 'Activity'},
  text: String
},{
    versionKey: false // You should be aware of the outcome after set to false
});
module.exports = mongoose.model("Notification", NotificationSchema);

/*
typeler;
1 - aktiviteye katıldın
2 - aktivitene katılım isteği

*/