const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   
    try {
       
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, 'Act1234SecretKey');
        req.userData = decodedToken;
        req.userId = decodedToken.id;
        next();
    }catch(error) {

        return res.status(401).send({
            message: 'Auth failed'
        });
    }
}