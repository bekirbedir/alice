const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser')
var crypto = require('crypto');
let ActivityComment = require("../Models/activity-comment")
let ActivityUser = require("../Models/activity-user-status")
var jwt = require('jsonwebtoken');
const user = require("../Models/user");
const notificationModel = require("../Models/notification");

router.get("/getComments", (req, response) => {

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, 'Act1234SecretKey');

    const activityId = req.query.id;


    ActivityComment.find({ activityId: activityId }, function (err, res) {
        if (err) {
            console.log("bulunamadı: " + err);
        }
        if (res) {
            response.send(res);
        }

    }
    )

})

router.post("/sendComment", async (req,res) => {

    /*

      res.status(200).json({
            status: true,
            message: "comment added successfully done"
        })
    */
   const activityComment = await saveComment(req,res);

    res.status(200).json({
        status: true,
        message: "comment added successfully done"
    })
   
  
   
})

saveComment = async function(req,res) {
    const activityComment = new ActivityComment();
    activityComment.userId = req.userId
    activityComment.text = req.body.text;
    activityComment.activityId = req.body.activityId;
    activityComment.username = req.body.username;
    activityComment.createdDate = Date.now();

    activityComment.save().then(result => {
        ActivityComment.find({activityId: activityComment.activityId}).distinct('userId', function(error, ids) {
            if (ids) {
                for(let i = 0 ; i<ids.length ; i++){
                    const notification = new notificationModel();
                    notification.activeUserId = ids[i];
                    notification.type = 3;
                    notification.text = 'Aktivite duvarına yeni mesaj geldi; ' + '"'+ req.body.text + '"';
                    notification.user = req.userId
                    notification.activity = req.body.activityId;
                    notification.activityId = req.body.activityId;
                    notification.userId = req.userId;
                    notification.save().then(result => {
                      
                    })
                }
             }
             if (error) {
                res.status(200).json({
                    status: false,
                    message: error
                })
             }
        });
    })
        .catch(error => {
            debugger
            console.log(error);
            res.status(200).json({
                status: false,
                message: error
            })
        });

}

module.exports = router;


