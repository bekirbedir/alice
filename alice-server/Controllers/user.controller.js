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
const ActivityUserStatus = require("../Models/activity-user-status");
const UserRate = require("../Models/user-rate");
const Notification = require("../Models/notification")
const ResponseModel = require("../Models/response-model");




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

      // console.log(err);
    }
    if (response) {
      res.send(response);
    }

  }
  )
})

router.post("/voteInfos", async (req, res) => {
  let toUserId = req.body.toUserId; //profiline girilen kullanıcı
  let positiveRateCount = await voteCountInfos(toUserId,1);
  let negativeRateCount = await voteCountInfos(toUserId,2);
  let totalRateCount = await voteCountInfos(toUserId,0);
  let rm = {
    positiveRateCount:positiveRateCount,
    negativeRateCount:negativeRateCount,
    totalRateCount:totalRateCount
  }
  res.status(200).send(rm);
  
})

voteCountInfos = async function(userId,rate){
  if(rate>0){
 let x = await  UserRate.countDocuments({ toUser: userId, rate:rate },async function (err, count) {
    if (err) {
    } else {
      return count;
    }
  });
  return x;
  }
  else{
  let x = await  UserRate.countDocuments({ toUser: userId }, async function (err, count) {
      if (err) {
      
      } else {
        return count;
      }
    });
    return x;
  }
 
}


router.post("/rateAccept", async (req, res) => {
  let toUserId = req.body.Id; //profiline girilen kullanıcı
  let currentUserId = req.userId;
  if(toUserId == currentUserId) {
    res.status(200).send(false);
  }

  let rm = await rateAccept(currentUserId, toUserId);
 
  if(rm.status){
    let vote = await existVote(currentUserId, toUserId);
    if(vote){
      rm.summary = vote.rate;
      rm.status = false;
      rm.message = "Daha önce oy verdiniz, oy değiştirmek için yönetici ile iletişime geçin."
    }else{
      rm.summary = 0;
    }
    res.status(200).send(rm);
  }else{
    res.status(200).send(rm);
  }
  

})

router.post("/vote", async (req, res) => {
  let toUserId = req.body.toUserId; //profiline girilen kullanıcı
  let fromUserId = req.userId;
  let rate = req.body.rate;
  if(toUserId == fromUserId) {
    res.status(200).send(false);
  }

  let rm = await rateAccept(fromUserId, toUserId);
  if(rm.status){ //oy verebilir mi kontrol 
    let vote = await existVote(fromUserId, toUserId);
    if(vote){ //oy degismez
      let rm = {
        status: false,
        toastType: "error",
        summary: "Daha önce oy kullanılmış",
        message: "Oy değiştirme yapılamaz"
      };
      res.status(200).send(rm);
     
    }else {
        //oy veriyor
        
        const vote = new UserRate();
        vote.toUser = toUserId
        vote.fromUser = fromUserId;
        vote.rate = rate;
        vote.save();
        if(rate == 1){
          saveNotification(toUserId, fromUserId , 8, "Bir kullanıcı sana OLUMLU oy verdi")
        }else{
          saveNotification(toUserId, fromUserId , 9, "Bir kullanıcı sana OLUMSUZ oy verdi")
        }
        let rm = {
          status: true,
          toastType: "success",
          summary: "Başarılı",
          message: "Oy kaydedildi."
        };

        res.status(200).send(rm);

    }
  }else {
    let rm = {
      status: false,
      toastType: "error",
      summary: "Oy veremez",
      message: "Oy değiştirme yapılamaz"
    };
    res.status(200).send(rm);
  }

  

})

saveNotification =function(toUserId, fromUserId , type, text){
  const notification = new Notification();
  notification.activeUserId = toUserId;
  notification.user = fromUserId;
  notification.text = text;
  notification.isShow = false;
  notification.type = type;
  notification.save()
}

existVote = async function (fromUserId, toUserId){
  const vote = await UserRate.findOne({ fromUser: fromUserId, toUser: toUserId }).exec();
  return vote;
}


rateAccept = async function (currentUserId, toUserId) {

  try {
 
    const joinedActivities = await ActivityUserStatus.find({ joined: true, user: currentUserId }, 'activityId').exec();
    var activityIds = [];
    joinedActivities.forEach(function (as) {
      activityIds.push(as.activityId); // activityIdleri toplanır
    });


   let x = await ActivityUserStatus.countDocuments({ joined: true, user: toUserId, activityId: { $in: activityIds } }, async function (err, count) {
      if (err) {
        return {
          status: false,
          toastType: 'error',
          message: err
        };
        
      } else {
        // console.log('there are %d jungle adventures', count);
        if (count > 3) {
          // console.log('burassss')
          return {
            status: true,
            toastType: 'success',
            message: "Oy verebilir"
          };
          

        }
        else {
          return {
            status: false,
            toastType: 'success',
            message: "Oy veremez"
          };
         
        }
      }
    });

    return x;
  }
  catch (error) {
    return {
      status: false,
      toastType: 'success',
      message: error
    };
  }
  
}





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

  let photoLink = req.files.photo.path.replace("\\", "/").replace("\\", "/").replace("\\", "/").split("/")[3]
  fileLink = "static/uploads/profile/" + photoLink
  User.findOne({ _id: req.userId }, function (err, user) {
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
          toastType: "success",
          summary: "Başarılı",
          message: "Şifreniz kaydedildi. Yeni şifre ile giriş yapabilirsiniz"
        })
      })
        .catch(error => {
          res.status(200).json({
            status: false,
            toastType: "error",
            summary: "Hata",
            message: "Hata oluştu; " + error
          })
        });
    }
    else {
      res.status(200).json({
        status: false,
        toastType: "error",
        summary: "Hata",
        message: "Şuanki şifrenizi yanlış girdiniz"
      })
    }
  })

})



module.exports = router;


