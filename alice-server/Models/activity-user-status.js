const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("../Models/user")
const ActivityUserStatusSchema = new Schema({
    status: Number,
    date: Date,
    activityId: String,
    userId: String,
    username: String,
    user: {type:Schema.Types.ObjectId, ref: 'User'},
}, {
    versionKey: false // You should be aware of the outcome after set to false
});
module.exports = mongoose.model("ActivityUserStatus", ActivityUserStatusSchema);


/*
1_Katılım isteği
2_onaylandı
3_katılmadı
*/