const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser')
var crypto = require('crypto');
let User = require("../Models/user")
let mailler = require("../mailler")
var jwt = require('jsonwebtoken');





router.post("/updateUserPhoto", (req, res) => {
  console.log(req.body.userId, "update User photo")

  if (!req.body.userId || !req.body.base64) {
    return res.status(404).send({
      message: 'Photo or userId can not be empty!',
    });
  }
  else {


    User.findOne({ _id: req.body.userId }, function (err, user) {
      user.userPhoto = req.body.base64
      user.save().then(result => {
        res.status(200).json({
          status: true,
          message: "user update successfully done"
        })
      })
        .catch(error => {
          res.status(200).json({
            status: false,
            message: "user update failed done"
          })
        });
    })

  }

})



router.get("/userview", (req, res) => {
  let pUsername = req.query.username
  console.log("pUsername", pUsername);
  if (!pUsername) {
    return res.status(404).send({
      message: 'Email or password can not be empty!',
    });
  }
  User.findOne({ username: pUsername }, function (err, docs) {
    if (docs) {
  
      return res.status(200).send(docs)
    }
    else {
      return res.status(200).send({ message: "user not find" })
    }
  })
})

router.post("/detail", (req, res) => {
  let id = req.body.Id;

  User.findOne({ _id: id }, function (err, response) {
    if (err) {
   
      console.log(err);
    }
    if (response) {
      console.log("res buldu")

      res.send(response);
    }

  }
  )
})

router.put("/updateUser", (req, res) => {

  User.findOne({ _id: req.body._id }, function (err, user) {
     
    user.name = req.body.name
      user.tagList = req.body.tagList
      user.biography = req.body.biography
      user.email = req.body.email
  //    user.phone = req.body.phone
  
      user.save().then(result => {
          res.status(200).json({
              status: true,
              message: "user update successfully done"
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


