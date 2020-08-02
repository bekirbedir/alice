export class Activity {
    __v: number;
    _Id:string;
    Id:Number
    username?: String  | null;
    createdDate?: String  | null;
    profilUrl?: String  | null;
    activityUrl?: String  | null;
    isActive?: Boolean  | null;
    header?: String  | null;
    context?: String  | null;
    tagList:[String];
    like?:Number|0;
    participationCount?:Number | 0;
  }
  