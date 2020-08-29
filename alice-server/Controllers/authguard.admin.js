const jwt = require('jsonwebtoken');
let User = require("../Models/user");

module.exports = (req, res, next) => {
   
    try {
       console.log("authguard admin")
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, 'Act1234SecretKey');
        req.userData = decodedToken;
        req.userId = decodedToken.id;
       
        //admin kontrol
        User.findOne({ _id: decodedToken.id, status: 3 }, function (err, user) {
            if (user) {
                console.log('userstatus:' , user.status)
                console.log('user.role', user.role)
                if(user.role != "ROLE_ADMIN"){
                    res.status(200).json({
                        status: false,
                        message: "Yetkisiz erişim " 
                    })
                }
                else{
                    req.userIsAdmin = true;
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


        next();
    }catch(error) {
        console.log("authguard admin cactch")
        return res.status(401).send({
            message: 'Auth failed'
        });
    }
}