"use strict";
const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
class Mailer {
  
  
// async..await is not allowed in global scope, must use a wrapper
static async  main(mailaddres ,subject, textHtml) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "info@activityfriend.com.tr",
        pass:  "dgszffhuxboqhkyg",
      }
    })
  );

  //        user: "activityfriendd@gmail.com",
  //      pass: "Act1234_"

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "info@activityfriend.com.tr",
     to: mailaddres, // list of receivers
    subject: subject, // Subject line
    text: "-ActivityFriend", // plain text body
    html: textHtml, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}



}

module.exports = Mailer;