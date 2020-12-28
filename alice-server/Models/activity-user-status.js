const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("../Models/user")
const Activity = require("../Models/activity")
const ActivityUserStatusSchema = new Schema({
    status: Number,
    date: Date,
    activityId: String,
    userId: String,
    username: String,
    joined:Boolean,
    like: {type:Boolean, default:false},
    user: {type:Schema.Types.ObjectId, ref: 'User'},
    activity: {type:Schema.Types.ObjectId, ref: 'Activity'}
}, {
    versionKey: false // You should be aware of the outcome after set to false
});
module.exports = mongoose.model("ActivityUserStatus", ActivityUserStatusSchema);


/*
0_hiçbirseyyok_like_atmis_olabilir //sayımlarda bu filterin cikmasi lazım
1_Katılım isteği
2_onaylandı
3_reddedildi
4_istegi_geri_cekti
5_katılmadı
*/