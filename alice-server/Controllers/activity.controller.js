const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser')
var crypto = require('crypto');
let Activity = require("../Models/activity")
let ActivityUser = require("../Models/activity-user-status")
var jwt = require('jsonwebtoken');
let User = require("../Models/user");
const ActivityUserStatus = require("../Models/activity-user-status");
const Notification = require("../Models/notification")
const multipart = require('connect-multiparty');
const fs = require('fs')
var path = require('path');
const multipartMiddleware = multipart({ uploadDir: './public/uploads' }); //bu calisiyor

//const multipartMiddleware = multipart({ uploadDir: '../' });





router.get("/getall", async (request, response, next) => {
    let search = request.query.q;
  
   
    try {
      
      //  const activityList = await Activity.find({ status: 3, date: { "$gt": Date.now() } }, null, { sort: 'date' }).
        const activityList = await Activity.search(search,{ status: 3, date: { "$gt": Date.now() - 12*60*60*1000 } }, null).sort('date').
        populate({ path: 'user', Model: '../Models/user' ,select:'_id username name email fileLink' }).exec();

    
        response.json(activityList);
    }
    catch (error) {
        console.log(error);
        return response.json(error);
    } 

})




router.get("/getActivityUserStatusList", (request, response) => {
    let userId = request.userId;
    
    const activityList = [];
    ActivityUserStatus.find({ userId: userId }, 'activityId status like', function (err, res) {
        if (err) {
            console.log(err);
        }
        if (res) {
            response.send(res);

        }
    }
    )

})

router.get("/getApprovedUsers", async (request, response) => {
    let activityId = request.query.id;
    console.log("activityId", activityId)
    try {
        const approvedUsers = await ActivityUserStatus.find({ status: 2, activityId: activityId }, null, { sort: 'date' })
        .populate({ path: 'user', Model: '../Models/user' ,select:'_id username name email fileLink' }).exec();
        response.json(approvedUsers);
    }
    catch (error) {
        console.log(error);
        return response.json(error);
    }
})


router.post("/getActivityAndUserStatus", (request, response) => {
    let userId = request.userId;
  
    let activityId = request.body.activityId

    const activityList = [];
    ActivityUserStatus.find({ activityId: activityId, userId: userId }, function (err, res) {
        if (err) {
            response.send([]);
        }
        if (res) {
            response.send(res);

        }
    }
    )

})



router.post("/", (req, res) => {

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, 'Act1234SecretKey');

    const activity = new Activity();
    activity.ownerId = '"' + decodedToken.id + '"'
    User.findOne({ _id: decodedToken.id }, function (err, user) {
        if (user) {
           
            //   activity._id = req.body._id
            activity.user = user;
            activity.username = req.body.username
            activity.tagList = req.body.tagList
            activity.isActive = true
            activity.profilUrl = req.body.profilUrl
            activity.activityUrl = req.body.activityUrl
            activity.header = req.body.header
            activity.participationLimit = req.body.participationLimit
            activity.participationCount = 0
            activity.like = req.body.like
            activity.date = req.body.date
            activity.context = req.body.context
            if(req.body.fileLink)
                 activity.fileLink = req.body.fileLink
            else{
                activity.fileLink = req.body.fileLink
            }
            activity.status = 1;
            activity.save().then(result => {
                res.status(200).json({
                    status: true,
                    message: "activity added successfully done"
                })
            })
                .catch(error => {
                    debugger
                    console.log(error);
                    next(error);
                });
        }
    });


})


router.delete("/", (req, res) => {

    Activity.findOneAndRemove({ _id: req.body._id }, function (err) {
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
router.get("/", async (req, response) => {
    let id = req.query.id;


    try {
      
        const activity = await Activity.findOne({ _id: id }, null, { sort: '-createdDate' }).exec();

      
        response.json(activity);
    }
    catch (error) {
      
        return response.json(error);
    }

})
router.put("/", (req, res) => {

    Activity.findOne({ _id: req.body._id }, function (err, activity) {
        activity._id = req.body._id
        activity.username = req.body.username
        activity.tagList = req.body.tagList
        activity.isActive = req.body.isActive
        activity.profilUrl = req.body.profilUrl
        activity.activityUrl = req.body.activityUrl
        activity.header = req.body.header
        activity.participationCount = req.body.participationCount
        activity.like = req.body.like
        activity.save().then(result => {
            res.status(200).json({
                status: true,
                message: "activity update successfully done"
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

router.post("/cancelActivity", (req, response) => {
    let userId = req.userId;
    let activityId = req.body.activityId;
 

    ActivityUser.findOne({ activityId: activityId, userId: userId }, function (err, activityUser) {
        if (activityUser) {
            activityUser.status = 0;
            activityUser.save();
        
            response.status(200).json({
                status: true,
                message: "deleted"
            })

        }
        else {
            response.status(200).json({
                status: false,
                message: "hata" + err
            })
        }
    })
})

router.post("/likeActivity", (req, response) => {
    let userId = req.userId;
    let activityId = req.body.activityId;
    console.log("userId", userId)

    ActivityUser.findOne({ activityId: activityId, userId: userId }, function (err, activityUser) {
        if (activityUser) {
            activityUser.like = true
            activityUser.save().then(result => {
                response.status(200).json({
                    status: true,
                    message: "liked"
                })
            });


        }
        else {
            User.findOne({ _id: userId }, function (err, user) {
                if (user) {
                    const activityUser = new ActivityUser();
                    activityUser.status = 0;
                    activityUser.date = Date.now();
                    activityUser.activityId = activityId;
                    activityUser.userId = userId;
                    activityUser.username = user.username;
                    activityUser.like = true;
                    activityUser.user = user;
                    activityUser.save().then(result => {
                        response.status(200).json({
                            status: true,
                            message: "liked"
                        })
                    })
                }
                else {
                    response.status(200).json({
                        status: false,
                        message: "hata" + err
                    })
                }

            })


        }
    })
})

router.post("/unlikeActivity", (req, response) => {
    let userId = req.userId;
    let activityId = req.body.activityId;
 

    ActivityUser.findOne({ activityId: activityId, userId: userId }, function (err, activityUser) {
        if (activityUser) {
            activityUser.like = false
            activityUser.save();
         
            response.status(200).json({
                status: true,
                message: "unliked"
            })

        }
        else {
            User.findOne({ _id: userId }, function (err, user) {
                if (user) {
                    const activityUser = new ActivityUser();
                    activityUser.status = 0;
                    activityUser.date = Date.now();
                    activityUser.activityId = activityId;
                    activityUser.userId = userId;
                    activityUser.username = user.username;
                    activityUser.like = false;
                    activityUser.user = user;
                    activityUser.save().then(result => {
                        response.status(200).json({
                            status: true,
                            message: "unliked"
                        })
                    })
                }
                else {
                    response.status(200).json({
                        status: false,
                        message: "hata" + err
                    })
                }

            })


        }
    })
})

router.post('/upload', multipartMiddleware, (req, res) => {
         
    let photoLink = req.files.photo.path.replace("\\","/").replace("\\","/").split("/")[2]        
                       
     res.json({
         status: true,
         message: 'File uploaded successfully',
         photoLink: photoLink
     });
 });
 
 router.get("/deleteFile", async (request, response) => {
     let filename = request.query.filename;
     try {
         fs.unlinkSync('./public/uploads/'+filename)
         return response.json({
            status: true,
            message: 'File uploaded successfully',
        });
     } catch (err) {
         console.error(err)
         return  response.json({
            status: false,
            message: err,
        });
     }
 })
 

router.post("/join", (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, 'Act1234SecretKey');

    Activity.findOne({ _id: req.body.activityId }, function (err, activity) {

        var index = activity.userList.findIndex(x => x.userId == decodedToken.id)
        // here you can check specific property for an object whether it exist in your array or not
        //   if (index === -1) 
        //   activity.userList.push({ status: 1, date: Date.now(), userId: decodedToken.id }) //eklenip eklenmeme

        User.findOne({ _id: decodedToken.id }, function (err, user) {
            if (user) {
                ActivityUser.findOne({ activityId: req.body.activityId, userId: decodedToken.id  }, function (err, activityUser) {
                    if (activityUser) {
                        activityUser.status = 1;
                        activityUser.date = Date.now();
                        activityUser.activityId = activity._id;
                        activityUser.userId = decodedToken.id;
                        activityUser.username = user.username;
                        activityUser.user = user;
                        activityUser.save().then(result => {
                            const notification = new Notification();
                            notification.activeUserId = user._id;
                            notification.activity = activity;
                            notification.user = null;
                            notification.text = "Aktiviteye katılım isteği gönderdin";
                            notification.isShow = true;
                            notification.type = 1;
                            notification.save().then(result => {
                                const notification2 = new Notification();
                                notification2.activeUserId = activity.ownerId.replace("\"", "").replace("\"", "");
                                notification2.activity = activity;
                                notification2.user = user;
                                notification2.text = "Aktivitene katılım isteği geldi";
                                notification2.type = 2;
                                notification2.save();
                            });
                        });
        
                        activity.actUser.push(activityUser);
                    }else{
                         activityUser = new ActivityUser();
                        activityUser.status = 1;
                        activityUser.date = Date.now();
                        activityUser.activityId = activity._id;
                        activityUser.userId = decodedToken.id;
                        activityUser.username = user.username;
                        activityUser.user = user;
                        activityUser.save().then(result => {
                            const notification = new Notification();
                            notification.activeUserId = user._id;
                            notification.activity = activity;
                            notification.user = null;
                            notification.text = "Aktiviteye katılım isteği gönderdin";
                            notification.isShow = true;
                            notification.type = 1;
                            notification.save().then(result => {
                                const notification2 = new Notification();
                                notification2.activeUserId = activity.ownerId.replace("\"", "").replace("\"", "");
                                notification2.activity = activity;
                                notification2.user = user;
                                notification2.text = "Aktivitene katılım isteği geldi";
                                notification2.type = 2;
                                notification2.save();
                            });
                        });
        
                        activity.actUser.push(activityUser);
                    }
                })
              
            }
            else {
                console.log("bulamadik");
                res.status(200).json({
                    status: false,
                    message: "kullanici bulunamadi"
                })
            }
        })




        activity.save().then(result => {
            res.status(200).json({
                status: true,
                message: "activity join request  done"
            })
        })
            .catch(error => {
                res.status(404).json({
                    status: false,
                    message: "activity join request failed done"
                })
            });
    })



})



module.exports = router;


