const express = require("express");
const router = express.Router();
let User=require("../Models/user")

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

module.exports = router;


