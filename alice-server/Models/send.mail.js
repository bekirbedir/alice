const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SendMailSchema = new Schema({
  userId: String,
  username:String,
  createdDate: String,
  textHtml:String,
  receivedMail: String,
  type: Number
});
module.exports = mongoose.model("SendMail",SendMailSchema);

/*
mail onay: 1
admin kullaniciyi onayladi: 2
aktivite acildi: 3
yenimesaj: 4 
yenigrupmesaj:5
şifresıfırlama: 6
şifrenizdegisti:7
katılımcı onayka:8
*/