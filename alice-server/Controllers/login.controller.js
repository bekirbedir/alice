const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser')
var crypto = require('crypto');
let User=require("../Models/user")
let SendMail=require("../Models/send.mail")
let mailler=require("../mailler")

var jwt = require('jsonwebtoken');
const sendMail = require("../Models/send.mail");


router.get("/all", (request, response) => {
  //buraya admin mi kontrolu eklenmeli
  User.find({},  function (err, res) {

    if (err) {
      console.log(err);
    }
    if (res) {
      response.send(res);
    }
  }
  )

})

router.post("/approve", (req, res) => {
    console.log("loggin-- appproveee" , req.body.code);
    pCode = req.body.code;
    pUsername = req.body.username;

    console.log("pCode" , pCode);
    console.log("pUsername" , pUsername);
    User.findOne({ mailOnayCode: pCode, username: pUsername }, function (err, user) {
        if (user) {
            console.log('userstatus:' , user.status)
            user.status = 2;
            console.log('usertatus: ' + user.status)
            user.updatedDate = Date.now();
            user.mailOnayCode = '';
            user.save().then(result => {
                res.status(200).json({
                    status: true,
                    message: "Kullanıcı onaylandı"
                })
            })
                .catch(error => {
                    res.status(200).json({
                        status: false,
                        message: "Hata oluştu; " + error
                    })
                });
        }
        else {
            console.log("bulamadik");
        }
    })

})


router.post("/signup", (req, res) => {
    let pUsername = req.body.username
    if (!req.body.username || !req.body.password) {
        return res.status(404).send({
            message: 'Email or password can not be empty!',
        });
    }
    else {

        User.findOne({ username: pUsername }, function (err, docs) {
            if (docs) {
               console.log("docsss var-----------------")
               res.status(200).json({
                  status: false,
                  message: "Bu kullanıcı adı daha önce alınmış."
              })
            }
            else {
              console.log("docsss yookkkkk-----------------")
                const user = new User();
                user.username = req.body.username
                user.password = crypto.createHash('md5').update(req.body.password).digest("hex");
                user.isActive = false,
                    user.biography = req.body.biography,
                    user.name = req.body.name
                user.email = req.body.email
                user.phone = req.body.phone
                user.createdDate = Date.now()
                user.status = 1
                var rString = randomString(25, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ').trim();
                user.mailOnayCode = rString;
                user.save();
                textHtml = "<b>Merhaba, ActivityFriend'e hoşgeldiniz!</b><p><a href='http://localhost:4200/login/" + rString + "/" + user.username + "'>Buraya tıklayarak mail adresinizi onaylayınız.</p>"
                subject = "ActivityFriend mail onayı"
                mailler.main(user.email, subject, textHtml);
                
                const sendMail = new SendMail();
                sendMail.userId = user._id;
                sendMail.username = user.username;
                sendMail.textHtml = textHtml;
                sendMail.type = 1;
                sendMail.createdDate = new Date();
                sendMail.save();

                return res.status(200).json({
                  status: true,
                  message: "Mail adresinizi onaylayın."
              })
            }
        });



    }
})

router.post("/login", (req, res) => {
    console.log(req.body.username)
    console.log(req.body.password)
    if (!req.body.username || !req.body.password) {
      return res.status(404).send({
        message: 'Email or password can not be empty!',
      });
    }
    else {
  
      const username = req.body.username;
      const password = crypto.createHash('md5').update(req.body.password).digest("hex");
      const potentialUser = { username: username, password: password , status: 3 };
      User.findOne(potentialUser)
        .then(user => {
          if (!user) {
            return res.status(200).send({
              message: 'fail',  
              error: 'User not found. Authentication failed.'
            });
          }
     
          const token = jwt.sign({
            name: user.username,
            id: user.id
          },
            'Act1234SecretKey',
            {
              expiresIn: "2h"
            }
          )
          return res.status(200).send({ message: 'success', token: token });
  
        })
    }
  })
  
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
module.exports = router;


