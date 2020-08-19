const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser')
var crypto = require('crypto');
let User=require("../Models/user")
let mailler=require("../mailler")
var jwt = require('jsonwebtoken');
router.get("/getall", (request, response) => {

    User.find({}, function(err, res) {
      
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

router.get("/getPending", (request, response) => {

  User.find({}, function(err, res) {
    
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

router.post("/userApprove",(req,res)=>{

  const user=new User();
  user.id = req.body._id

  User.findOne({ _id: req.body._id }, function (err, user){
          if(user){
            user.status = 3;
            user.updatedDate = Date.now();
            user.save().then(result => {
              res.status(200).json({
                  status: true,
                  message: "Kullanıcı onaylandı"
              })
            })
              .catch(error => {
                  res.status(200).json({ 
                      status: false,
                      message: "Hata oluştu; " + error
                  })
             });
          }
          else{
            console.log("bulamadik");
          }
            })

})

router.post("/userReject",(req,res)=>{

  const user=new User();
  user.id = req.body._id

  User.findOne({ _id: req.body._id }, function (err, user){
          if(user){
            user.status = 4;
            user.updatedDate = Date.now();
            user.save().then(result => {
              res.status(200).json({
                  status: true,
                  message: "Kullanıcı onaylandı"
              })
            })
              .catch(error => {
                  res.status(200).json({ 
                      status: false,
                      message: "Hata oluştu; " + error
                  })
             });
          }
          else{
            console.log("bulamadik");
          }
            })

})
router.post("/login",(req,res)=>{
  console.log(req.body.username)
  console.log(req.body.password)
  if (!req.body.username || !req.body.password) {
    return res.status(404).send({
    message: 'Email or password can not be empty!',
    });
}
else {
  
  const username = req.body.username;
  const password = crypto.createHash('md5').update(req.body.password).digest("hex");
  const potentialUser = {username: username,password: password};
  User.findOne(potentialUser)
            .then(user => {
                if(!user) {
                    return res.status(404).send({
                         message: 'fail',
                         error: 'User not found. Authentication failed.'
                     });
                }
            //    console.log("user id::::" ,)
                const token = jwt.sign({
                  name: user.username,
                  id: user.id
              }, 
              'secret_key',
              {
                  expiresIn :"2h"
              }
              )
              return res.status(200).send({ message: 'success', token: token});

            })
}
})

router.post("/signup",(req,res)=>{
  let pUsername=req.body.username
  if (!req.body.username || !req.body.password) {
    return res.status(404).send({
    message: 'Email or password can not be empty!',
    });
}
else{
  
  User.findOne({ username: pUsername}, function (err, docs) {
    if(docs){
      console.log(docs)
      return res.status(404).send({message:"User is existing"})
    }
    else{
      const user=new User();
      user.username=req.body.username 
      user.password=crypto.createHash('md5').update(req.body.password).digest("hex");
      user.isActive=false,
      user.biography=req.body.biography,
      user.name=req.body.name
      user.email=req.body.email
      user.phone=req.body.phone
      user.createdDate=Date.now()
      user.status = 2 
      user.save()
      mailler.main(user.email);
      return res.status(200).send({message:"user added"})
    }
  });


 
   }
})

router.get("/userview",(req,res)=>{
  let pUsername=req.query.username
  console.log("pUsername", pUsername);
  if (!pUsername) {
    return res.status(404).send({
    message: 'Email or password can not be empty!',
    });
     }
    User.findOne({ username: pUsername}, function (err, docs) {
  if(docs){
    console.log(docs)
    return res.status(200).send(docs)
  }
  else{
    return res.status(200).send({message:"user not find"})
  }
})
})

router.get("/detail",(req,res)=>{
  let id = req.query.Id;
  console.log("-----burasi",id);
  User.findOne({Id:id}, function(err, res) {
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

module.exports = router;


