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




router.post("/updateUserPhoto", (req, res) => {

  if (!req.body.userId || !req.body.base64) {
    return res.status(404).send({
      message: 'Photo or userId can not be empty!',
    });
  }
  else {


    User.findOne({ _id: req.body.userId }, function (err, user) {
      user.userPhoto = req.body.base64
      user.save().then(result => {
        res.status(200).json({
          status: true,
          message: "user update successfully done"
        })
      })
        .catch(error => {
          res.status(200).json({
            status: false,
            message: "user update failed done"
          })
        });
    })

  }

})



router.get("/userview", (req, res) => {
  let pUsername = req.query.username
  
  if (!pUsername) {
    return res.status(404).send({
      message: 'Email or password can not be empty!',
    });
  }
  User.findOne({ username: pUsername }, function (err, docs) {
    if (docs) {
  
      return res.status(200).send(docs)
    }
    else {
      return res.status(200).send({ message: "user not find" })
    }
  })
})

router.post("/detail", (req, res) => {
  let id = req.body.Id;

  User.findOne({ _id: id }, function (err, response) {
    if (err) {
   
      console.log(err);
    }
    if (response) {
          res.send(response);
    }

  }
  )
})






router.put("/updateUser", (req, res) => {

  User.findOne({ _id: req.body._id }, function (err, user) {
     
    user.name = req.body.name
      user.tagList = req.body.tagList
      user.biography = req.body.biography
      user.email = req.body.email
  //    user.phone = req.body.phone
  
      user.save().then(result => {
          res.status(200).json({
              status: true,
              message: "user update successfully done"
          })
      })
          .catch(error => {
              res.status(200).json({
                  status: false,
                  message: "activity update failed done"
              })
          });
  })
})



router.post('/upload', multipartMiddleware, (req, res) => {
     
 let photoLink = req.files.photo.path.replace("\\","/").replace("\\","/").replace("\\","/").split("/")[3]                            
  fileLink = "static/uploads/profile/" + photoLink
  User.findOne({_id: req.userId} ,function(err,user){
    user.fileLink = fileLink;
    user.save();
  })
 res.json({
      status: true,
      message: 'File uploaded successfully',
      photoLink: photoLink
  });
});


router.post("/savePassword", (req, res) => {

  pUsername = req.body.username;
  pCurrentPassword = req.body.currentPassword;
  pPassword = req.body.password;
  pRepeatPassword = req.body.repeatPassword;

  hashCurrentPassword = crypto.createHash('md5').update(pCurrentPassword).digest("hex");


  User.findOne({ password: hashCurrentPassword, username: pUsername }, function (err, user) {
    if (user) {

      user.password = crypto.createHash('md5').update(pRepeatPassword).digest("hex");
      user.updatedDate = Date.now();
          user.save().then(result => {
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
            message: "Şuanki şifrenizi yanlış girdiniz"
      })
    }
  })

})



module.exports = router;


