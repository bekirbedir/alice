const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser')
var crypto = require('crypto');
let Activity=require("../Models/activity")
var jwt = require('jsonwebtoken');
router.get("/getall", (request, response) => {

    Activity.find({}, function(err, res) {
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
  const activity=new Activity();
  activity.Id=req.body.Id
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
        message: "activity added successfully done"
    })
})
    .catch(error => {
        debugger
        console.log(error);
        next(error);
    });
  
})


router.delete("/",(req,res)=>{
    
    Activity.findOneAndRemove({ Id: req.body.Id }, function(err) {
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

router.put("/",(req,res)=>{

    Activity.findOne({ Id: req.body.Id }, function (err, activity){
        activity.Id=req.body.Id
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

module.exports = router;


