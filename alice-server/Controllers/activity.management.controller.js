const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser')
var crypto = require('crypto');
let ActivityUser = require("../Models/activity-user-status")
let Activity = require("../Models/activity")
var jwt = require('jsonwebtoken');
const Notification = require("../Models/notification")

router.post("/getUsers", async (request, response) => {

    //buraya yonetici mi kontrolu eklenmeli
    pActivityId = request.body.activityId;
    pStatus = request.body.status;

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



router.post("/userStateAction", (request, res) => {

    pActivityId = request.body.activityId;
    pUserId = request.body.userId;
    pStatus = request.body.status;
    console.log("userId", pUserId);
    console.log("activityId", pActivityId);
    try {
        ActivityUser.findOne({ activityId: pActivityId, userId: pUserId }, function (err, actUser) {
            if (actUser) {
                actUser.status = pStatus;
                console.log("-----------actUserstatus----", actUser.status)
                actUser.save().then(result => {
                    if (pStatus == 2) {
                        const notification = new Notification();
                        notification.activeUserId = pUserId
                        notification.activity = pActivityId;
                        notification.user = null;
                        notification.text = "Katılım isteğin onaylandı";
                        notification.isShow = false;
                        notification.type = 4;
                        notification.save().then(result => {
                            res.status(200).json({
                                status: true,
                                message: "activity join request  done1"
                            })
                        });
                    }
                    if (pStatus == 3) {
                        const notification = new Notification();
                        notification.activeUserId = pUserId
                        notification.activity = pActivityId;
                        notification.user = null;
                        notification.text = "Katılım isteğin reddedildi";
                        notification.isShow = false;
                        notification.type = 5;
                        notification.save().then(result => {
                            res.status(200).json({
                                status: true,
                                message: "activity join request  done1"
                            })
                        });
                    }
                    else {

                        res.status(200).json({
                            status: true,
                            message: "activity join request  done1"
                        })

                    }


                })
                    .catch(error => {
                        console.log("error",error)
                        res.status(200).json({
                            status: false,
                            message: "activity update failed done; " + error 
                        })
                    });
            }
            if (err) {
                console.log(err)
            }
        }
        )
    }
    catch (error) {
        res.status(200).json({
            status: false,
            message: "activity update failed done" + error
        })
    }


})

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

})


router.delete("/", (req, res) => {

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

router.put("/updateActivity", (req, res) => {
    console.log(" req.body._id", req.body.activity._id);
    Activity.findOne({ _id: req.body.activity._id }, function (err, activity) {
        console.log('bulundu')
        activity._id = req.body.activity._id
        activity.tagList = req.body.activity.tagList
        activity.header = req.body.activity.header
        activity.participationCount = req.body.activity.participationCount
        activity.like = req.body.activity.like
        activity.date = req.body.activity.date
        activity.context = req.body.context
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

router.post("/getActivity", async (request, response) => {
    pActivityId = request.body.activityId;


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


