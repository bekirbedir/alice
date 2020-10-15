const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser')
var crypto = require('crypto');
let User = require("../Models/user")
let SendMail = require("../Models/send.mail")
let mailler = require("../mailler")

var jwt = require('jsonwebtoken');
const sendMail = require("../Models/send.mail");



router.post("/approve", (req, res) => {
  pCode = req.body.code;
  pUsername = req.body.username;

  console.log("pCode", pCode);
  console.log("pUsername", pUsername);
  User.findOne({ mailOnayCode: pCode, username: pUsername }, function (err, user) {
    if (user) {
      console.log('userstatus:', user.status)
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
      res.status(200).json({
        status: false,
        message: "Hata oluştu; " 
      })
    }
  })

})


router.post("/savePassword", (req, res) => {
  pCode = req.body.code;
  pUsername = req.body.username;
  pNewPassword = req.body.newPassword;


  User.findOne({ resetPasswordCode: pCode, username: pUsername }, function (err, user) {
    if (user) {
      console.log("pUsername",pUsername)
      console.log("pNewPassword",pNewPassword)
      user.password = crypto.createHash('md5').update(pNewPassword).digest("hex");
      console.log(" user.password", user.password)
      user.resetPasswordCode = '';
      user.updatedDate = Date.now();
      user.mailOnayCode = '';

      user.save().then(result => {

        textHtml = "<b>Merhaba, ActivityFriend şifreniz yenilendi </b><p><a href='https://www.activityfriend.com.tr/login/'>Buraya tıklayarak giriş yapabilirsiniz.</p><br><br>"
        subject = "ActivityFriend şifreniz yenilendi"
        mailler.main(result.email, subject, textHtml);
        const sendMail = new SendMail();
        sendMail.userId = result._id;
        sendMail.username = result.username;
        sendMail.textHtml = textHtml;
        sendMail.receivedMail = result.email;
        sendMail.type = 7;
        sendMail.createdDate = new Date();
        sendMail.save();

        res.status(200).json({
          status: true,
          toastType: "success" ,
          summary: "Başarılı" ,
          message: "Şifreniz kaydedildi. Yeni şifre ile giriş yapabilirsiniz"
        })
      })
        .catch(error => {
          res.status(200).json({
            status: false,
            toastType: "error" ,
            summary: "Hata" ,
            message: "Hata oluştu; " + error
          })
        });
    }
    else {
      res.status(200).json({
            status: false,
            toastType: "error" ,
            summary: "Hata" ,
            message: "Linkin kullanım süresi dolmuş veya kullanıcı bulunamadı."
      })
    }
  })

})


router.post("/resetPasswordRequest", (req, res) => {

  pUsername = req.body.username;

  User.findOne({$or:[ {'username':pUsername}, {'email':pUsername} ]}, function (err, user) {
    if (user) {
      user.updatedDate = Date.now();
      user.resetPasswordCode = randomString(25, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ').trim();
      user.save().then(result => {

     
        textHtml = "<b>Merhaba, ActivityFriend şifrenizi sıfırlama talebinizi aldık. </b><p><a href='https://www.activityfriend.com.tr/reset-password/" + result.resetPasswordCode + "/" + result.username + "'>Buraya tıklayarak şifrenizi yenileyebilirsiniz.</p><br><br>"
        subject = "ActivityFriend şifre sıfırlama"
        mailler.main(result.email, subject, textHtml);
        const sendMail = new SendMail();
        sendMail.userId = result._id;
        sendMail.username = result.username;
        sendMail.textHtml = textHtml;
        sendMail.receivedMail = result.email;
        sendMail.type = 6;
        sendMail.createdDate = new Date();
        sendMail.save();

        res.status(200).json({
          status: true,
          toastType: 'success',
          message: "Sistemde kayıtlı olan mail adresinize, şifre sıfırlama maili gönderildi."
        })
      })
        .catch(error => {
          res.status(200).json({
            status: false,
            toastType: "error" ,
            summary: "Hata" ,
            message: "Hata oluştu; " + error
          })
        });
    }
    else {
      res.status(200).json({
        status: false,
        toastType: "error" ,
        summary: "Hata" ,
        message: 'Böyle bir kullanıcı adı veya mail bulunamadı' 
      })
    }
  })

})

router.post("/signup", (req, res) => {
  let pUsername = req.body.username
  if (!req.body.username || !req.body.password || !req.body.email ) {
    return res.status(404).send({
      message: 'Email or username or password can not be empty!',
    });
  }
  else {

    User.findOne({  $or:[ {'username':pUsername}, {'email':req.body.email} ]}, function (err, docs) {
      if (docs) {
        if(docs.username == pUsername){
          res.status(200).json({
            status: false,
            message: "Bu kullanıcı adı daha önce alınmış."
          })
        }else{
          res.status(200).json({
            status: false,
            message: "Bu email adresi daha önce kullanılmıştır."
          })
        }
       
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
        user.tagList = req.body.tagList;
        user.createdDate = Date.now()
        user.status = 1
        user.role = "ROLE_USER"
        user.fileLink = "static/uploads/profile/empty_profile128.png";
        var rString = randomString(25, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ').trim();
        user.mailOnayCode = rString;
        user.save().then(result => {
          console.log("----------user save-------")
          textHtml = "<b>Merhaba, ActivityFriend'e hoşgeldiniz!</b><p><a href='https://www.activityfriend.com.tr/login/" + rString + "/" + user.username + "'>Buraya tıklayarak mail adresinizi onaylayınız.</p><br>Kullanıcı adınız: "+ user.username + "<br>"
          subject = "ActivityFriend mail onayı"
          mailler.main(user.email, subject, textHtml);

          const sendMail = new SendMail();
          sendMail.userId = user._id;
          sendMail.username = user.username;
          sendMail.textHtml = textHtml;
          sendMail.receivedMail = user.email;
          sendMail.type = 1;
          sendMail.createdDate = new Date();
          sendMail.save();

          return res.status(200).json({
            status: true,
            message: "Mail adresinizi onaylayın."
          })
        })
          .catch(error => {
            res.status(200).json({
              status: false,
              message: error
            })
          });;

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
    console.log(req.body.username)
    console.log(req.body.password)
    const password = crypto.createHash('md5').update(req.body.password).digest("hex");
    console.log(password)
    const potentialUser = { $or:[ {'username':username}, {'email':username} ], password: password, status: 3 };
    User.findOne(potentialUser)
      .then(user => {
        if (!user) {
          return res.status(200).send({
            message: 'fail',
            error: 'User not found. Authentication failed...!'
          });
        }

        const token = jwt.sign({
          name: user.username,
          id: user.id
        },
          'Act1234SecretKey',
          {
            expiresIn: "500h"
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


