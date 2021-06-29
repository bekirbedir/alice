let Activity = require("../Models/activity")
let mailler = require("../mailler")
let SendMail = require("../Models/send.mail")
const Notification = require("../Models/notification")
const firebaseNotification = require('./firebaseNotification');
module.exports = {

    activityFinish: async function () {
     
      const activityList = await Activity.search('',{ status: 3,'isFinished':false,date: { "$lt": Date.now()  } }, null).populate({ path: 'user', Model: '../Models/user' ,select:'_id username name email fileLink' }).exec();
      activityList.forEach(
        (element) => {
          console.log('element-header', element.header);
          textHtml = "<b>Merhaba, "+ element.header +" başlıklı  etkinliğinizdeki kullanıcıların katılım durumunu onaylamayı unutmayınız... "
          +"</b><p><a href='https://www.activityfriend.com.tr/'>https://www.activityfriend.com.tr</p>"
          subject = "Etkinlik katılımcılarını onaylayın"
          mailler.main(element.user.email, subject, textHtml);
          const sendMail = new SendMail();
          sendMail.userId = element.user._id;
          sendMail.username = element.user.username;
          sendMail.textHtml = textHtml;
          sendMail.receivedMail = element.user.email;
          sendMail.type = 8;
          sendMail.createdDate = new Date();
          saveNotification(element.user._id, null ,element._id, 10, "Etkinliğe onayladığın kullanıcıların katılım durumu onaylama zamanı :)")
          sendMail.save();
          element.isFinished = true;
          element.finishDate = Date.now();
          element.save();

        }
      );

   //   console.log(activityList)
   
     },




};

saveNotification =function(toUserId, fromUserId ,activityId, type, text){
  const notification = new Notification();
  notification.activeUserId = toUserId;
  notification.user = fromUserId;
  notification.activity = activityId;
  notification.text = text;
  notification.isShow = false;
  notification.type = type;
  notification.save()
  firebaseNotification.notificationSend(toUserId,text,'')
}