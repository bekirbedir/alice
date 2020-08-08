import { UserStatus } from 'src/app/models/user.status';

export class Activity {
    __v: number;
    _Id:string;
    Id:Number
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
    userList:[UserStatus];
    currentUserStatus: Number | 0;
    ownerId:String | null;
  }
  