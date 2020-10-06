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

        const notificationList = await NotificationSchema.find({ activeUserId: userId } , null, { sort: '-createdDate' }).limit(20).populate([{ path: 'user', Model: '../Models/user' },{ path: 'activity', Model: '../Models/activity' }]).exec();
        response.json(notificationList);
    }
    catch (error) {
        console.log(error);
        return response.json(error);
    }

})



module.exports = router;


