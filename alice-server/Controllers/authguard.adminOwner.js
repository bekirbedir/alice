const jwt = require('jsonwebtoken');
let User = require("../Models/user");

module.exports = (req, res, next) => {
   
    try {
    
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, 'Act1234SecretKey');
        req.userData = decodedToken;
        req.userId = decodedToken.id;
       
        //admin kontrol
        User.findOne({ _id: decodedToken.id, status: 3 }, function (err, user) {
            if (user) {
                if( user.role != "ROLE_ADMIN"){
                    res.status(200).json({
                        status: false,
                        message: "Yetkisiz erişim,not admin " 
                    })
                }
                else{
                    req.userIsAdmin = true;
                    next();
                }
            }
            else {
                console.log("bulamadik");
                res.status(200).json({
                    status: false,
                    message: "Yetkisiz erişim,Kullanıcı Bulunamadı " + error
                })
            }
        })
        //admin kontrol


       
    }catch(error) {
        return res.status(401).send({
            message: 'Auth failed'
        });
    }
}