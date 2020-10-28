const db = require("./db")();
const express = require("express");
var cors = require('cors')

const app = express();
var path = require('path');
var bodyParser = require('body-parser')
var auhtguardAdmin=require('./Controllers/authguard.admin')
var auhtguardUser=require('./Controllers/authguard.user')
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static('public'))
const usersRouter = require("./Controllers/user.controller");
const activityRouter = require("./Controllers/activity.controller");
const activityViewRouter = require("./Controllers/activity-view.controller");
const activityCommentRouter = require("./Controllers/activity.comment");
const activityManagementRouter = require("./Controllers/activity.management.controller");
const loginRouter = require('./Controllers/login.controller');
const communicationRouter = require("./Controllers/communication.controller");
const adminRouter = require("./Controllers/admin.controller");
const notificationRouter = require("./Controllers/notification.controller");
const smsRouter=require("./Controllers/sms.controller");




var router = express.Router(); 
// app.use('/users/',auhtguard, usersRouter);
app.use('/users/', auhtguardUser,usersRouter);
app.use('/activity-view/',activityViewRouter)
app.use('/activity/',auhtguardUser,activityRouter); //auth controlu yapiliyor
app.use('/notification/',auhtguardUser,notificationRouter); //auth controlu yapiliyor
app.use('/activity-comment/',auhtguardUser,activityCommentRouter); 
app.use('/activity-management/',activityManagementRouter);
app.use('/login/',loginRouter)
app.use('/communication/', communicationRouter);
app.use('/sms/', smsRouter);
app.use('/admin/', auhtguardAdmin,adminRouter);

//app.use('/activity/',activityRouter);

const port= process.env.PORT || 3000;
var server =app.listen(port, () => {
  console.log(`localhost:${port} -> api working !!! `);
});
/*
app.get('/captchaControl', recaptcha.middleware.render, function(req, res){
  console.log('---------------------',recaptcha)
  
 
}); */




module.exports = app;  






