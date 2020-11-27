const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser')
var crypto = require('crypto');
let ActivityUser = require("../Models/activity-user-status")
let Activity = require("../Models/activity")
var jwt = require('jsonwebtoken');
const NotificationSchema = require("../Models/notification");

router.post("/getNotifications", async (request, response) => {

    let userId = request.userId;

    try {

        const notificationList = await NotificationSchema.find({ activeUserId: userId }, null, { sort: '-createdDate' }).limit(20).populate(
            [{ path: 'user', Model: '../Models/user' , select:'_id username name fileLink'},
             { path: 'activity', Model: '../Models/activity'  ,  select:'_id header fileLink'}]).exec();
        const x = await NotificationSchema.updateMany({ activeUserId: userId }, { isShow: true });
        response.json(notificationList);
    }
    catch (error) {
        console.log(error);
        return response.json(error);
    }

})

router.post("/count", async (request, response) => {

    let userId = request.userId;

    try {

        const notificationList = await NotificationSchema.count({ activeUserId: userId, isShow: false }, function (err, count) {
            if (err)
                response.json(0);
            else
                response.json(count);
        })

    }
    catch (error) {
        console.log(error);
        return response.json(error);
    }

})



module.exports = router;


