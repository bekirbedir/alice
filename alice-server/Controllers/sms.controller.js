const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser')
var crypto = require('crypto');
let User = require("../Models/user")
let mailler = require("../mailler")
var jwt = require('jsonwebtoken');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: './public/uploads/profile' }); //bu calisiyor
var request = require('request')

router.post("/sendSms", (req, res) => {

    let number = req.body.number;
    let code=Number(req.body.code)*2-1428  

    User.findOne({  $or:[ {'phone':number}]}, function (err, docs) {
      if(docs){
        res.status(200).json({
          status: false,
          message: "Bu telefon numarası daha önce kullanılmıştır."
        })
      }
      else{
        var myXMLText = '<smspack ka="temelbugra" pwd="123.Bugra" org="ACTV.FRIEND" ><mesaj><metin>Sms onay kodunuz:'+code+'</metin><nums>'+number+'</nums></mesaj></smspack>'
        request({
            url: "https://smsgw.mutlucell.com/smsgw-ws/sndblkex",
            method: "POST",
            headers: {
                "content-type": "text/xml; charset=UTF-8",  // <--Very important!!!
            },
            body: myXMLText
        }, function (error, response, body){
            if(res){
              res.status(200).json({
                  status: true,
                  message: "Message gönderildi"
              })
            }
            if(error){
              res.status(200).json({
                  status: false,
                  message: "Message gönderilemedi"
              })
            }  
        
        });
      }
    })
  })

  module.exports = router;