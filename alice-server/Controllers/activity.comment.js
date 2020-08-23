const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser')
var crypto = require('crypto');
let ActivityComment = require("../Models/activity-comment")
let ActivityUser = require("../Models/activity-user-status")
var jwt = require('jsonwebtoken');

router.get("/getComments", (req, response) => {
    console.log("-----------getcomments-------------")
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, 'secret_key');
    console.log("userId", decodedToken.id);
    console.log("id", req.query.id);
    const activityId = req.query.id;
    console.log("activiyyID : " + activityId);

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

router.post("/sendComment", (req,res) => {

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, 'secret_key');
    console.log("userId", decodedToken.id);
    console.log("activityId", req.body.activityId);

    const activityComment = new ActivityComment();
    activityComment.userId = decodedToken.id
    activityComment.text = req.body.text;
    activityComment.activityId = req.body.activityId;
    activityComment.username = req.body.username;
    activityComment.createdDate = Date.now();

    activityComment.save().then(result => {
        res.status(200).json({
            status: true,
            message: "comment added successfully done"
        })
    })
        .catch(error => {
            debugger
            console.log(error);
            next(error);
        });

})

module.exports = router;


