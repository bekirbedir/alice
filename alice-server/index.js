const db = require("./db")();
const express = require("express");
var cors = require('cors')
const app = express();
var path = require('path');
var bodyParser = require('body-parser')

var cronUtils = require('./util/cronExec');


let User = require("./Models/user")
try {

User.find({day:null}).then(users=>{
  console.log('yeni uye')
  for(var i = 0 ; i<users.length ; i++){

   var month1 = new Date(users[i].birthDate).getUTCMonth()+1 ;
   var day1 = new Date(users[i].birthDate).getUTCDate() ;
   users[i].day= day1;
   users[i].month = month1;
   users[i].save();
  }
})

}
catch (error) {
  console.log('---hataa-----')
}
//////
/*
var admin = require("firebase-admin");


var serviceAccount = require("./alice-firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://alice-bb.firebaseio.com"
});

const notification_options = {
  priority: "high",
  timeToLive: 60 * 60 * 24
};

  const  registrationToken = 'dh5LcgV1QfSeMlqJtBkmaO:APA91bEISOAVVmHJT8iSMOmff_9rWbD1ZmBYNSrccM48IiB4MU93HoPbBU6wd-X8D9rGe0_rkNZpy6sEa5xtE8Hjp41XEtvWHPeSdE-3eVZ66wr599UuAw2it5o5jFGK4WgG0FtvbXLg';
  const options =  notification_options
  const message_notification = {
    notification: {
       title: 'harun test',
       body: 'enter_message_here'
       }
    };

    admin.messaging().sendToDevice(registrationToken, message_notification, options)
    .then( response => {
      console.log('response:', response)
  console.log('OKOKOKOK')
     
    })
    .catch( error => {
      console.log('ERRRRORRR')
        console.log(error);
    });

*/


//////
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

var CronJob = require('cron').CronJob;

var job = new CronJob('40 * * * *', function() {
   cronUtils.activityFinish()
   console.log('cron job calisti')
}, null, true, 'America/Los_Angeles');
job.start();


var router = express.Router(); 
// app.use('/users/',auhtguard, usersRouter);
app.use('/users/', auhtguardUser,usersRouter);
app.use('/activity-view/',activityViewRouter)
app.use('/activity/',auhtguardUser,activityRouter); //auth controlu yapiliyor
app.use('/notification/',auhtguardUser,notificationRouter); //auth controlu yapiliyor
app.use('/activity-comment/',auhtguardUser,activityCommentRouter); 
app.use('/activity-management/',auhtguardUser,activityManagementRouter);
app.use('/login/',loginRouter)
app.use('/communication/', communicationRouter);
app.use('/sms/', smsRouter);
app.use('/admin/', auhtguardAdmin,adminRouter);

//app.use('/activity/',activityRouter);

const port= process.env.PORT || 3000;
var server =app.listen(port, () => {
  console.log(`localhost:${port} -> api working !!! `);
 // cronUtils.activityFinish()
});
/*
app.get('/captchaControl', recaptcha.middleware.render, function(req, res){
  console.log('---------------------',recaptcha)
  
 
}); */




module.exports = app;  






