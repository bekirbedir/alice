const fetch = require('node-fetch');
var admin = require("firebase-admin");


var serviceAccount = require("../alice-firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://alice-eb692.firebaseio.com"
});

var notification = {
    'title': 'title of notification',
    'text': 'subtitle'
}

var fcmTokens = [];

var notificationBody = {
    'notification': notification,
    'registration_ids' : fcmTokens
}

fetch('', {
    'method' : 'POST',
    'headers' : {
        'Authorization': 'key=' + 'AAAAnnFzSMo:APA91bH-7qS4nDEdLuopV599zU5urFVWNOW9V1eHJCsIdJC8vmOdh9s1YW4vcS8EGDv54ymHLCViQfnlYH5bGjGFPP0XSfJ7jsnToWFwkiqwuO18sWt_1vZcoLY9ZLFS2MdTD2KrGs6m',
        'Content-Type':'application/json'
    },
    'body' : JSON.stringify(notificationBody)
}).then(()=>{
    console.log('basarili')
}).catch((err)=>{
    console.log(err)
})