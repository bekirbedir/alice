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
     + req.body.comment 
     + " <br>"
     + " Gönderen Kişi: " + req.body.firstname + " " + req.body.lastname
     + " <br>"
     + " Telefon: " +  req.body.phone
     + " Email: " +  req.body.mail
    mailler.main(req.body.mail,subject , text);     
    return res.status(200).send({ message: "mail created and send to "+req.body.mail })
})
module.exports = router;
