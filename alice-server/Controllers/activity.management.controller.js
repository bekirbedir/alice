const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser')
var crypto = require('crypto');
let ActivityUser = require("../Models/activity-user-status")
let Activity = require("../Models/activity")
var jwt = require('jsonwebtoken');
const Notification = require("../Models/notification")
var genericFunction = require('../util/genericFunction');

isAdminOrOwner = async function(userId,activityId){
    if(userId == null || userId == 0 || userId == undefined || userId == "" 
    || activityId == null || activityId == 0 || activityId == undefined || activityId == "" )
        return false;

    let isAdmin = await genericFunction.isAdmin(userId);
    if(isAdmin){
        return true;
    }else{
        let isOwner = await genericFunction.isActivityOwner(userId,activityId);
        if(isOwner)
            return true;
        else
            return false;
    }
}

router.post("/getUsers", async (request, response) => {

    
    //buraya yonetici mi kontrolu eklenmeli
    pActivityId = request.body.activityId;
    pStatus = request.body.status;

    let grantControl = await isAdminOrOwner(request.userId , pActivityId )
    if(!grantControl){
        return response.json({
            status: false,
            message: "Yetkisiz erişim "
        })
    }

    try {
        const users = await ActivityUser.find({ status: pStatus, activityId: pActivityId }, null, { sort: 'date' }).
            populate({ path: 'user', Model: '../Models/user', select: '_id username name email fileLink' }).exec();
        response.json(users);
    }
    catch (error) {
        console.log(error);
        return response.json(error);
    }

})

router.post("/joined", (request, res) => {

    pActivityId = request.body.activityId;
    pUserId = request.body.userId;
    pJoined = request.body.joined;
    let joined = false; //2 katıldı , 1 katılmadı
    if(pJoined == 2)
        joined = true;    

    ActivityUser.findOne({ activityId: pActivityId, userId: pUserId }, function (err, actUser) {

        if(actUser){
            actUser.joined = joined;
            actUser.save().then(result => {
                let responseMessage = "Kullanıcı KATILDI olarak işaretlendi.";
                if(!joined)
                responseMessage = "Kullanıcı KATILMADI olarak işaretlendi.";

                res.status(200).json({
                    status: true,
                    toastType: "success" ,
                    summary: "Başarılı" ,
                    message: responseMessage
              })
            })
            
        }else{
            res.status(200).json({
                status: false,
                toastType: "error" ,
                summary: "Hata" ,
                message: err
          })
        }

    })
          
   })


router.post("/userStateAction", async (request, res) => {

    pActivityId = request.body.activityId;
    pUserId = request.body.userId;
    pStatus = request.body.status;

    let grantControl = await isAdminOrOwner(request.userId , pActivityId )
    if(!grantControl){
        return res.json({
            status: false,
            message: "Yetkisiz erişim "
        })
    }


    try {
        ActivityUser.findOne({ activityId: pActivityId, userId: pUserId }, function (err, actUser) {
            if (actUser) {
                actUser.status = pStatus;
               
                actUser.save().then(result => {
                    if (pStatus == 2) {
                        saveNotification(pUserId, null ,pActivityId, 4, "Katılım isteğin onaylandı")
                    }
                    if (pStatus == 3) {
                        saveNotification(pUserId, null ,pActivityId, 5, "Katılım isteğin reddedildi")           
                    }
                    updatAactivityParticipantCount(pActivityId);   
                    let rm = {
                        status: true,
                        message: "kaydedildi" + pStatus
                    }
                    res.send(rm);


                })
                    .catch(error => {
                        let rm = {
                            status: false,
                            message: "activity user update failed done; " + error 
                        }
                        res.send(rm);
                    });
            }
            if (err) {
                console.log(err)
            }
        }
        )
    }
    catch (error) {
       
        let rm = {
            status: false,
            message: "activity user 2 update failed done" + error
        }
        res.send(rm);
    }


})

saveNotification =function(toUserId, fromUserId ,activityId, type, text){
    const notification = new Notification();
    notification.activeUserId = toUserId;
    notification.user = fromUserId;
    notification.activity = activityId;
    notification.text = text;
    notification.isShow = false;
    notification.type = type;
    notification.save()
  }

updatAactivityParticipantCount = function(pActivityId){
    
        
     ActivityUser.countDocuments({ activityId: pActivityId, status:2 }, function (errCount, count) {
        if (errCount){
             console.log('updateActivityParticipant',err)
           } else{

           Activity.findOne({ _id: pActivityId }, function (err, activity) {
                 activity.participationCount = count
                   activity.save();
                   })
            }
                                
     });
                      
}


router.post("/", (req, res) => {

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, 'Act1234SecretKey');

    const activity = new Activity();
    activity.ownerId = '"' + decodedToken.id + '"'
    activity.Id = req.body.Id
    activity.username = req.body.username
    activity.tagList = req.body.tagList
    activity.isActive = true
    activity.profilUrl = req.body.profilUrl
    activity.activityUrl = req.body.activityUrl
    activity.header = req.body.header
    activity.participationCount = req.body.participationCount
    activity.like = req.body.like
    activity.context = req.body.context
    activity.save().then(result => {
        let rm = {
            status: true,
            message: "activity added successfully done"
        }
        res.send(rm);
       
    })
        .catch(error => {
            debugger
            console.log(error);
            next(error);
        });

})


router.delete("/", async (req, res) => {


    let grantControl = await isAdminOrOwner(req.userId , req.body.Id )
    console.log('grantControl',grantControl)
    if(!grantControl){
        return res.json({
            status: false,
            message: "Yetkisiz erişim "
        })
    }

    Activity.findOneAndRemove({ Id: req.body.Id }, function (err) {
        if (!err) {
            res.status(200).json({
                status: true,
                message: "activity delete successfully done"
            })
        }
        else {
            res.status(200).json({
                status: false,
                message: "activity delete failed done"
            })
        }
    });

})

router.put("/updateActivity", async (req, res) => {
  

    let grantControl = await isAdminOrOwner(req.userId , req.body.activity._id  )
    console.log('grantControl',grantControl)
    if(!grantControl){
        return res.json({
            status: false,
            message: "Yetkisiz erişim "
        })
    }

    Activity.findOne({ _id: req.body.activity._id }, function (err, activity) {
        
        activity.context = req.body.activity.context
        activity.tagList = req.body.activity.tagList
        activity.header = req.body.activity.header
        activity.participationCount = req.body.activity.participationCount
        activity.like = req.body.activity.like
        activity.date = req.body.activity.date
        activity.fileLink = req.body.activity.fileLink
        activity.status = 1;
        activity.save().then(result => {
            res.status(200).json({
                status: true,
                message: "activity update successfully done"
            })
        })
            .catch(error => {
                res.status(200).json({
                    status: false,
                    message: error
                })
            });
    })
})

router.put("/deleteActivity", async (req, res) => {
  
    
    let grantControl = await isAdminOrOwner(req.userId , req.body.activity._id  )
    console.log('grantControl',grantControl)
    if(!grantControl){
        return res.json({
            status: false,
            message: "Yetkisiz erişim "
        })
    }

    Activity.findOne({ _id: req.body.activity._id }, function (err, activity) {
        console.log('bulundu')
        activity.status = 4;
        activity.save().then(result => {
            res.status(200).json({
                status: true,
                message: "activity deleted successfully done"
            })
        })
            .catch(error => {
                res.status(200).json({
                    status: false,
                    message: error
                })
            });
    })
})

router.post("/getActivity", async (request, response) => {
    pActivityId = request.body.activityId;

    
    let grantControl = await isAdminOrOwner(request.userId , pActivityId )
    console.log('grantControl',grantControl)
    if(!grantControl){
        return response.json({
            status: false,
            message: "Yetkisiz erişim "
        })
    }

    try {
        Activity.findOne({ _id: pActivityId }, function (err, res) {
            if (res) {
                response.send(res);
            }
            else {
                return response.json({ status: false, message: err });
            }
        })

    }
    catch (error) {
        console.log(error);
        return response.json(error);
    }

})



module.exports = router;


