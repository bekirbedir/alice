const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser')
var crypto = require('crypto');
let Activity=require("../Models/activity")
let ActivityUser=require("../Models/activity-user-status")
var jwt = require('jsonwebtoken');
let User=require("../Models/user");
const activityUserStatus = require("../Models/activity-user-status");



router.get("/getall",( request, response) => {
     
    const activityList = [];
    Activity.find({},null,{sort: '-createdDate'}, function(err, res){
        if (err) {
          console.log(err);
        }
        if(res){
            
            res.forEach(element=>{
                element.actUser = [];
                activityUserStatus.find({activityId:element._id},function(err, actUser){
                   if(actUser){
                    console.log("element:res[i]:"  + element.header)
                      element.actUser.push(actUser);
                    }
                   
                    })
                   
            })
           /* for(var i = 0 ; i<res.length; i++ ){
               
                console.log("activityId:res[i]:"  +res[i]._id)
                activityUserStatus.find({activityId:res[i]._id},function(err, actUserr){
                   if(actUserr){
                    console.log("activityId:res[i]:"  + res[i].header)
                     res[i].actUser = actUserr;
                    }

                    })
            } */
            setTimeout(function(){    response.send(res); }, 3000);
         
            /*
            res.forEach(element=>{
                element.actUser = [];
                activityUserStatus.find({activityId:element._id},function(err, actUser){
                   if(actUser){
                      element.actUser.push(actUser);
                    }
                   
                    })
                   
            })
           
                response.send(res); */
           
           
        }
    }
    )

})


router.post("/",(req,res)=>{
  
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, 'Act1234SecretKey');

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
  activity.date=req.body.date
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
    const decodedToken = jwt.verify(token, 'Act1234SecretKey');
  
    Activity.findOne({_id:req.body.activityId}, function(err, activity) {

        var index =   activity.userList.findIndex(x => x.userId==decodedToken.id)
      // here you can check specific property for an object whether it exist in your array or not

     if (index === -1){
        activity.userList.push({status:1,date:Date.now(),userId:decodedToken.id}) //eklenip eklenmeme
    
        User.findOne({ _id: decodedToken.id }, function (err, user){
            if(user){
                const activityUser = new ActivityUser();
                activityUser.status = 1;
                activityUser.date = Date.now();
                activityUser.activityId = activity._id;
                activityUser.userId = decodedToken.id;
                activityUser.username = user.username;
                activityUser.user = user;
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
            else{
              console.log("bulamadik");
            }
              })

       
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


