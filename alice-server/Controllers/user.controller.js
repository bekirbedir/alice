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


