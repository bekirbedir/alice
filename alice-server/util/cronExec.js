let Activity = require("../Models/activity")
let mailler = require("../mailler")
let SendMail = require("../Models/send.mail")

module.exports = {

    activityFinish: async function () {
     


      const activityList = await Activity.search('',{ status: 3,$or:[ {'isFinished':false}, {'isFinished':null} ] ,date: { "$lt": Date.now()  } }, null).populate({ path: 'user', Model: '../Models/user' ,select:'_id username name email fileLink' }).exec();
      activityList.forEach(
        (element) => {
      
          element.isFinished = true;
          element.finishDate = Date.now();
          element.save();
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
          sendMail.save();

        }
      );

   //   console.log(activityList)
   
     },




};
