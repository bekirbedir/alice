let Activity = require("../Models/activity")
let mailler = require("../mailler")
let SendMail = require("../Models/send.mail")
const User = require("../Models/user")

var admin = require("firebase-admin");

var serviceAccount = require("../alice-firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://alice-bb.firebaseio.com"
});

const notification_options = {
  priority: "high",
  timeToLive: 60 * 60 * 24
};


module.exports = {

    notificationSend: async function (userId,title,body) {
     let user =await User.findOne({ _id: userId, status: 3 }).exec();
         if (user && user.firebaseToken != null && user.firebaseToken != "") {
            ///////////////////////////////////////////////////
            const  registrationToken = user.firebaseToken;
            const options =  notification_options
            const message_notification = {
              notification: {
                 title: title,
                 body: body
                 }
              };
          
              admin.messaging().sendToDevice(registrationToken, message_notification, options)
              .then( response => {
              
              })
              .catch( error => {
                console.log('ERRRRORRR FIREBASE NOTI')
                  console.log(error);
              });
            ///////////////////////////////////////////////////
        }
        else {
          return false;
        }
      //admin kontrol
   
     }

};

