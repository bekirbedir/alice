import { UserStatus } from 'src/app/models/user.status';

export class Activity {
    __v: number;
    _id:string | null;
    id:Number
    userId?:String | null
    username?: String  | null;
    createdDate?: String  | null;
    profilUrl?: String  | null;
    activityUrl?: String  | null;
    isActive?: Boolean  | null;
    header?: String  | null;
    context?: String  | null;
    tagList:string[];
    like?:Number|0;
    participationCount?:Number | 0;
    status:Number |1;
    userList:[UserStatus];
    currentUserStatus: Number | 0;
    ownerId:String | null;
    date?: Date;
  }
  