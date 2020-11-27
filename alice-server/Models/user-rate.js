const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user")
const UserRateSchema = new Schema({
    
    fromUser: {type:Schema.Types.ObjectId, ref: 'User'},
    toUser: {type:Schema.Types.ObjectId, ref: 'User'},
    createdDate: {type: Date, default: Date.now},
    rate:Number,
    comment: String
    

}, {
    versionKey: false // You should be aware of the outcome after set to false
});
module.exports = mongoose.model("UserRate", UserRateSchema);


/*
rate 0 = Olumsuz
rate 1 = Olumlu
*/