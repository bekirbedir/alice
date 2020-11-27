
import { User } from '../auth/user';

export class UserRate {
  fromUser:  User | null;
  toUser:  User | null;
  createdDate: Date;
  comment: String;
  rate: Number
}

/*
rate 0 = Olumsuz
rate 1 = Olumlu
*/