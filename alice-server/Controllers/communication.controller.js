const express = require("express");
const router = express.Router();
let mailler=require("../mailler")
var jwt = require('jsonwebtoken');

router.post("/createInfo",(req,res)=>{
    const object = JSON.stringify(req.body);
    console.log(object)
    subject =  "Activity Friend İletişim Formu Yeni Mesaj  - "  + req.body.firstname + " " + req.body.lastname
    text:String
    text ="Bir yeni mesaj"
     + "<br>"
     + " Mesaj:"
     + "<br><b> "
     + req.body.comment 
     + " </b><br>"
     + "<br>"
     + "  Gönderen Kişi: " + req.body.firstname + " " + req.body.lastname
     + " <br>"
     + "  Telefon: " +  req.body.phone
     + "<br>"
     + "  Email: " +  req.body.eMail
    mailler.main(req.body.mail,subject , text);     
    res.status(200).json({
        status: true,
        message: "message sended."
    })
})
module.exports = router;
