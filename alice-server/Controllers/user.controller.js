const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser')
var crypto = require('crypto');
let User = require("../Models/user")
let mailler = require("../mailler")
var jwt = require('jsonwebtoken');
router.get("/getall", (request, response) => {

  User.find({}, function (err, res) {

    if (err) {
      console.log(err);
    }
    if (res) {
      console.log(res)
      response.send(res);
    }
  }
  )

})

router.get("/getPending", (request, response) => {

  //buraya admin mi kontrolu eklenmeli
  User.find({}, function (err, res) {

    if (err) {
      console.log(err);
    }
    if (res) {
      console.log(res)
      response.send(res);
    }
  }
  )

})

router.post("/userApprove", (req, res) => {
  //buraya admin mi kontrolu eklenmeli
  const user = new User();
  user.id = req.body._id

  User.findOne({ _id: req.body._id }, function (err, user) {
    if (user) {
      user.status = 3;
      user.updatedDate = Date.now();
      user.save().then(result => {
        subject = "ActivityFriend Kullanıcınız Onaylandı"
        textHtml = "<H4><b>Merhaba, ActivityFriend'e Hoşgeldiniz! Kaydınız onaylanmıştır! </b></H4> <br> <p><a href='http://localhost:4200/login'></H5>Buraya tıklayarak giriş yapabilirsiniz.</H5></p>"
        mailler.main(user.email,subject, textHtml);
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
    else {
      console.log("bulamadik");
    }
  })

})

router.get("/mailApprove", (req, res) => {
  //buraya admin mi kontrolu eklenmeli

  let pMailOnayCode = req.query.onaycode
  let pUsername = req.query.username
  user.id = req.body._id

  User.findOne({ username: pUsername, mailOnayCode: pMailOnayCode }, function (err, user) {
    if (user) {
      user.status = 2;
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
    else {
      console.log("bulamadik");
    }
  })

})

router.post("/userReject", (req, res) => {
  //buraya admin mi kontrolu eklenmeli
  const user = new User();
  user.id = req.body._id

  User.findOne({ _id: req.body._id }, function (err, user) {
    if (user) {
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
    else {
      console.log("bulamadik");
    }
  })

})
router.post("/login", (req, res) => {
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
    const potentialUser = { username: username, password: password };
    User.findOne(potentialUser)
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'fail',
            error: 'User not found. Authentication failed.'
          });
        }
   
        const token = jwt.sign({
          name: user.username,
          id: user.id
        },
          'secret_key',
          {
            expiresIn: "2h"
          }
        )
        return res.status(200).send({ message: 'success', token: token });

      })
  }
})

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



module.exports = router;


