let Activity = require("../Models/activity")
let mailler = require("../mailler")
let SendMail = require("../Models/send.mail")
const User = require("../Models/user")

module.exports = {

    isAdmin: async function (userId) {
     
         //admin kontrol
     let user =await User.findOne({ _id: userId, status: 3 }).exec();
         if (user) {
            if( user.role == "ROLE_ADMIN"){
               return true;
            }
            else{
               return false;
            }
        }
        else {
          return false;
        }
      //admin kontrol
   
     },

     isActivityOwner: async function (userId,activityId) {
     console.log('userId',userId)
     console.log('activityId',activityId)
      //admin kontrol
      let x = await Activity.findOne({_id:activityId, user: userId }).exec();
      if(x)
        return true;
      else
        return false;
     },
     clearSpaceWord: async function(word){
       return toLowerCase().trim().replace(/ /g,"")
     },
     clearquote: async function(word){
      return toLowerCase().trim().replace(/"/g,"")
    },
     isSelfRequest: async function(currentUserId, toUserId){
        if(currentUserId.trim() == toUserId.trim())
          return true;
        else
          return false;
     }
     


};

