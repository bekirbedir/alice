
import { User } from '../auth/user';

export class ActivityUserStatus {
  status?: Number | 0;
  date?: Date;
  activityId?: String | null;
  userId: String | null;
  username: String |null;
  user: User | null
}

/*
1	Katılım isteği
2	onaylandı
3	reddedildi
4	katılmadı
*/