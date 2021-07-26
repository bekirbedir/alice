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
const Activity = require("../Models/activity");
const UserRate = require("../Models/user-rate");
const Notification = require("../Models/notification")
const ResponseModel = require("../Models/response-model");
var genericFunction = require('../util/genericFunction');
const firebaseNotification = require('../util/firebaseNotification');


router.post("/allUsers", async (req, res,next) => {
  let search = req.body.search;
  if(search == "" || search == null){
  //  var filter = { $and: [ { status: 3}]  };
    var filter = { $and: [{ status: 3},{ fileLink: { $ne: 'static/uploads/profile/empty_profile128.png' } }, { fileLink: { $ne: null } }, { fileLink: { $ne: '' } }] };
    
    var fields = { _id:1, fileLink:2, biography:3, username:4, name:5 ,tagList:6 };
    var options = { skip: 10, limit: 5 };
    User.findRandom(filter, fields, options, function (err, results) {
      if (!err) {
        res.json(results);
      }
    });
    
  }else
  {
  const userList = await User.search(search,{ status: 3}).select('_id fileLink biography username name tagList').sort('createdDate').limit(10).exec();
   res.json(userList);
  }
})

Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}
router.post("/birthdayUsers", async (req, res,next) => {

var dateCurrent = new Date().addHours(3);
var day = dateCurrent.getUTCDate()-1;
var month = dateCurrent.getUTCMonth()+1;
  let search = req.body.search;
    const userList = await User.search(search,{ status: 3,
     day:day,
     month:month
  }).select('_id fileLink biography username name tagList').sort('createdDate').limit(10).exec();
   res.json(userList);
      
})


router.post("/detail", async (req, res) => {
  let id = req.body.Id;

  if(await genericFunction.isSelfRequest(id,req.userId)){

    User.findOne({ _id: id }, function (err, response) {
      if (err) {
         console.log(err);
      }
      if (response) {
        res.send(response);
      }
    }
    )
  }else{
    User.findOne({ _id: id },'_id username name tagList biography fileLink gender birthDate', function (err, response) {
      if (err) {
         console.log(err);
      }
      if (response) {
        res.send(response);
      }
  
    }
    )
  }
  


})



router.post("/myActivities", (req, res) => {
  let id = req.body.Id;
/*
  let grantControl = await genericFunction.isSelfRequest(req.userId , id )
  if(!grantControl){
      return res.json({
          status: false,
          message: "Yetkisiz erişim "
      })
  }*/
  Activity.find({ user: id }, '_id header context', function (err, response) {
    if (err) {
      res.send(err)
    }
    if (response) {
      res.send(response);
    }
  }
  )
})

router.post("/IJoinedActivities", async (req, res) => {
  let id = req.body.Id;

  /*
  let grantControl = await genericFunction.isSelfRequest(req.userId , id )
  if(!grantControl){
      return res.json({
          status: false,
          message: "Yetkisiz erişim "
      })
  } */

  /*
  const activity = await ActivityUserStatus.find({user: req.userId ,joined:true}, null, { sort: '-date' })
  .populate({path:'user', Model:  '../Models/user' , select:'_id username name email fileLink'}).exec();
  response.json(activity);   */

//'_id header context'



 let joinedActivities = await ActivityUserStatus.find({ user: id , joined:true },'activityId' ).distinct('activityId').exec();

 if (joinedActivities) {
  let x = await Activity.find().
   where('_id').in(joinedActivities).
  sort('-date').
   select('_id header context').
   exec(); 
//   let x = await Activity.find({  _id: { $in: joinedActivities } }).select('_id header context').exec(); bu da kullanılabilir
   res.send(x); 
}
else{
  res.send(false); 
}
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

router.post("/joinActivityInfos", async (req, res) => {
  let toUserId = req.body.toUserId; //profiline girilen kullanıcı
  let katildi = await joinedCountInfos1(toUserId,2,true);
  let katilmadi = await joinedCountInfos1(toUserId,2,false);
  let reddedildi = await joinedCountInfos(toUserId,3);
  let istekgeriCekti = await joinedCountInfos(toUserId,4);
  let rm = {
    katildi:katildi,
    katilmadi:katilmadi,
    reddedildi:reddedildi,
    istekgeriCekti:istekgeriCekti
  }
  res.send(rm);
  
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

joinedCountInfos1 = async function(userId,status,joined){

 let x = await  ActivityUserStatus.countDocuments({ user: userId, joined:joined,status:status },async function (err, count) {
    if (err) {
    } else {
      return count;
    }
  });

  return x;
   
}

joinedCountInfos = async function(userId,status){
 
  let x = await  ActivityUserStatus.countDocuments({ user: userId, status:status },async function (err, count) {
     if (err) {
     } else {
       return count;
     }
   });
 
   return x;
    
 }


router.post("/rateAccept", async (req, res) => {
  let toUserId = req.body.Id; //profiline girilen kullanıcı
  let currentUserId = req.userId;
 
  if(toUserId == currentUserId) {
    console.log('aynıı')
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
  
    res.send(rm);
  }else{
    res.send(rm);
  }
  

})

router.post("/vote", async (req, res) => {
  let toUserId = req.body.toUserId; //profiline girilen kullanıcı
  let fromUserId = req.userId;
  let rate = req.body.rate;
  if(toUserId == fromUserId) {
    res.send(false);
  }
  console.log('aaaa')
  let rm = await rateAccept(fromUserId, toUserId);
  if(rm.status){ //oy verebilir mi kontrol 
    let vote = await existVote(fromUserId, toUserId);
    if(vote){ //oy degismez
      /*let rm = {
        status: false,
        toastType: "error",
        summary: "Daha önce oy kullanılmış",
        message: "Oy değiştirme yapılamaz"
      };
      res.send(rm); */

      vote.toUser = toUserId
      vote.fromUser = fromUserId;
      vote.rate = rate;
      vote.save();
      if(rate == 1){
        saveNotificationFunc(toUserId, fromUserId , 8, 'Bir kullanıcı sana OLUMLU oy verdi')
      }else{
        saveNotificationFunc(toUserId, fromUserId , 9, 'Bir kullanıcı sana OLUMSUZ oy verdi')
      }
      let rm = {
        status: true,
        toastType: "success",
        summary: "Başarılı",
        message: "Oy kaydedildi."
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
          saveNotificationFunc(toUserId, fromUserId , 8, 'Bir kullanıcı sana OLUMLU oy verdi')
        }else{
          saveNotificationFunc(toUserId, fromUserId , 9, 'Bir kullanıcı sana OLUMSUZ oy verdi')
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
    res.send(rm);
  }

  

})

saveNotificationFunc =function(toUserId, fromUserId , type, text){
  const notification = new Notification();
  notification.activeUserId = toUserId;
  notification.user = fromUserId;
  notification.text = text;
  notification.isShow = false;
  notification.type = type;
  notification.activity = null;
  notification.save()
  console.log('text',text)
  firebaseNotification.notificationSend(toUserId,text,'')
}

existVote = async function (fromUserId, toUserId){
  const vote = await UserRate.findOne({ fromUser: fromUserId, toUser: toUserId }).exec();
  return vote;
}


rateAccept = async function (currentUserId, toUserId) {

    rm = {};
    const joinedActivities = await ActivityUserStatus.find({ joined: true, user: currentUserId }, 'activityId').exec();
    var activityIds = [];
    joinedActivities.forEach(function (as) {
      activityIds.push(as.activityId); // activityIdleri toplanır
    });
  

   let x = await ActivityUserStatus.countDocuments({ joined: true, user: toUserId, activityId: { $in: activityIds } }).exec();
   /*, async function (err, count) {
      if (err) {
        console.log('if err', err)
        rm =  {
          status: false,
          toastType: 'error',
          message: err
        };
        console.log('rm4', rm)
      } else {
         console.log('else count-----', count);
        if (count > 3) {
           console.log('burassss3')
           rm =  {
            status: true,
            toastType: 'success',
            message: "Oy verebilir"
          };
          console.log('rm5', rm)

        }
        else {
          console.log('burassss3den kucuk')
          rm = {
            status: false,
            toastType: 'success',
            message: "Oy veremez"
          };
          console.log('rm6', rm)
        }
      }
    }); */
   
    if(x>2){
      return  {
        status: true,
        toastType: 'success',
        message: "Oy verebilir"
      };
    }else{
      return  {
        status: false,
        toastType: 'error',
        message: "Oy veremez 3 ten az"
      };
    }
  
  
}





router.put("/updateUser", async (req, res) => {
if(await genericFunction.isSelfRequest(req.userId,req.body._id)){
  User.findOne({ _id: req.userId }, function (err, user) {
    user.name = req.body.name
    user.tagList = req.body.tagList
    user.biography = req.body.biography
    user.email = req.body.email
    user.birthDate = req.body.birthDate
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
}
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


