const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser')
var crypto = require('crypto');
let User = require("../Models/user")
let Activity = require("../Models/activity")
let mailler = require("../mailler")
var jwt = require('jsonwebtoken');
const Notification = require("../Models/notification")
const firebaseNotification = require('../util/firebaseNotification');



router.get("/users/getall", (request, response) => {

  User.find({}, function (err, res) {

    if (err) {
      console.log(err);
    }
    if (res) {
      console.log(res)
      response.send(res);
    }
  }
  )

})

router.get("/users/getPending", (request, response) => {
  //buraya admin mi kontrolu eklenmeli
  User.find({status:2}, function (err, res) {

    if (err) {
      console.log(err);
      response.send(err);
    }
    if (res) {
      response.send(res);
    }
  }
  )

})

router.get("/users/getPendingMailApproveUsers", (request, response) => {
  //buraya admin mi kontrolu eklenmeli
  User.find({status:1}, function (err, res) {

    if (err) {
      console.log(err);
      response.send(err);
    }
    if (res) {
      response.send(res);
    }
  }
  )

})

router.get("/users/getAllUsers", (request, response) => {
  //buraya admin mi kontrolu eklenmeli
  User.find({status:3}, function (err, res) {

    if (err) {
      console.log(err);
      response.send(err);
    }
    if (res) {
      response.send(res);
    }
  }
  )

})

router.get("/activity/getPending",async  (request, response) => {
  //buraya admin mi kontrolu eklenmeli


  try{
      
    const activity = await Activity.find({status:1}, null, { sort: '-createdDate' })
    .populate({path:'user', Model:  '../Models/user' , select:'_id username name email fileLink'}).exec();
    response.json(activity);    
  }
catch (error) {
    console.log(error); 
    return response.json(error);
  }



})

router.post("/activity/activityApprove", (req, res) => {
  //buraya admin mi kontrolu eklenmeli
 
 let pActivityId = req.body._id

  Activity.findOne({ _id: pActivityId }, function (err, act) {
    if (act) {
      act.status = 3;
      act.updatedDate = Date.now();
      act.save().then(result => {
        User.findOne({_id:act.user},function(err,actUser){
          const notification = new Notification();
          notification.activeUserId = actUser._id;
          notification.activity = act._id;
          notification.user = null;
          notification.text = "Aktiviten Onaylandı";
          notification.isShow = false;
          notification.type = 6;
          notification.save();
          subject = "ActivityFriend Etkinlik Onayı"
          textHtml = "<H4>Merhaba,<b>"+ act.header + "</b> isimli etkinliğin onaylandı! İyi eğlenceler</H4>"
          mailler.main(actUser.email,subject, textHtml);
          firebaseNotification.notificationSend(actUser._id,'Aktiviten Onaylandı',act.header +' isimli etkinliğin onaylandı! İyi eğlenceler')
          res.status(200).json({
            status: true,
            message: "Aktivite onaylandı"
          })
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


router.post("/users/userApprove", (req, res) => {
  //buraya admin mi kontrolu eklenmeli
  const user = new User();
  user.id = req.body._id

  User.findOne({ _id: req.body._id }, function (err, user) {
    if (user) {
      user.status = 3;
      user.updatedDate = Date.now();
      user.save().then(result => {
        subject = "ActivityFriend Kullanıcınız Onaylandı"
        textHtml = "<H4><b>Merhaba, ActivityFriend'e Hoşgeldiniz! Kaydınız onaylanmıştır! </b></H4> <br><br> Kullanıcı Adınız: "+user.username+ " <br> <p><a href='https://www.activityfriend.com.tr/login'></H5>Buraya tıklayarak giriş yapabilirsiniz.</H5></p>"
        mailler.main(user.email,subject, textHtml);
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




router.post("/users/userReject", (req, res) => {
  //buraya admin mi kontrolu eklenmeli
  const user = new User();
  user.id = req.body._id

  User.findOne({ _id: req.body._id }, function (err, user) {
    if (user) {
      user.status = 4;
      user.updatedDate = Date.now();
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






module.exports = router;


