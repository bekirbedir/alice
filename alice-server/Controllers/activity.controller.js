const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser')
var crypto = require('crypto');
let Activity=require("../Models/activity")
let ActivityUser=require("../Models/activity-user-status")
var jwt = require('jsonwebtoken');
router.get("/getall", (request, response) => {
     
   
    Activity.find({}, function(err, res) {
        if (err) {
          console.log(err);
        }
        if(res){
        response.send(res);
        }
    }
    )

})
router.post("/",(req,res)=>{
  console.log(req.body)
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, 'secret_key');
  console.log("decode",decodedToken.id)
  const activity=new Activity();
  activity.ownerId='"'+decodedToken.id+'"'
  activity._id=req.body._id
  activity.username=req.body.username
  activity.tagList=req.body.tagList
  activity.isActive=true
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
    
    Activity.findOneAndRemove({ _id: req.body._id }, function(err) {
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

    Activity.findOne({ _id: req.body._id }, function (err, activity){
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

router.post("/join",(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, 'secret_key');
    console.log("decode",decodedToken.id)
    console.log("id",req.body.activityId)
    Activity.findOne({_id:req.body.activityId}, function(err, activity) {

        var index =   activity.userList.findIndex(x => x.userId==decodedToken.id)
      // here you can check specific property for an object whether it exist in your array or not

     if (index === -1){
        activity.userList.push({status:1,date:Date.now(),userId:decodedToken.id}) //eklenip eklenmeme
    
        const activityUser = new ActivityUser();
        activityUser.status = 1;
        activityUser.date = Date.now();
        activityUser.activityId = activity._id;
        activityUser.userId = decodedToken.id;
        activityUser.save().then(result=>{
         /*   res.status(200).json({
                status: true,
                message: "activity join request  done"
            }) */
        })
        .catch(error => {
          /*  res.status(404).json({ 
                status: false,
                message: "activity join request failed done"
            }) */
        });
    }
        
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


