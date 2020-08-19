const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser')
var crypto = require('crypto');
let ActivityView=require("../Models/activity-view");
let Activity=require("../Models/activity");
var jwt = require('jsonwebtoken');


router.get("/", (req, response) => {
    let id = req.query.id;
    console.log("-----burasi",id);
    Activity.findOne({_id:id}, function(err, res) {
        if (err) {
          console.log(err);
        }
        if(res){
        console.log(res)
        response.send(res);
        }

    }
    )

})

router.post("/",(req,res)=>{
  console.log(req.body)
  const activity=new ActivityView();
  activity._id=req.body._id
  activity.username=req.body.username
  activity.tagList=req.body.tagList
  activity.isActive=req.body.isActive
  activity.profilUrl=req.body.profilUrl
  activity.activityUrl=req.body.activityUrl
  activity.header=req.body.header
  activity.participationCount=req.body.participationCount
  activity.like=req.body.like
  activity.context = req.body.context
  activity.save().then(result => {
    res.status(200).json({
        status: true,
        message: "activity-view added successfully done"
    })
})
    .catch(error => {
        debugger
        console.log(error);
        next(error);
    });
  
})


router.delete("/",(req,res)=>{
    
    ActivityView.findOneAndRemove({ _id: req.body._id }, function(err) {
        if (!err) {
            res.status(200).json({
                status: true,
                message: "activity-view delete successfully done"
            })
        }
        else {
            res.status(200).json({
                status: false,
                message: "activity-view delete failed done"
            })
        }
    });

})

router.put("/",(req,res)=>{

    ActivityView.findOne({ _id: req.body._id }, function (err, activity){
        activity._id=req.body._id
        activity.username=req.body.username
        activity.tagList=req.body.tagList
        activity.isActive=req.body.isActive
        activity.profilUrl=req.body.profilUrl
        activity.activityUrl=req.body.activityUrl
        activity.header=req.body.header
        activity.participationCount=req.body.participationCount
        activity.like=req.body.like
        activity.save().then(result => {
            res.status(200).json({
                status: true,
                message: "activity-view update successfully done"
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

module.exports = router;


