import { User } from '../auth/user';
import { Activity } from './activity';


export class NotificationModel {
     _id:string | null;
     user: User | null;
     activity: Activity;
     activeUserId: String;
     type: Number | 0;
     userId: String;
     activityId: String;
     createdDate: Date;
     isShow: {type:Boolean , default:false};
     text: String;
  }
  