import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { GetFriends } from 'src/app/store/actions/friend.action';
import { Friend } from 'src/app/models/friend';
import { FriendState } from 'src/app/store/states/friend.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users:Friend[]
  user=""
  @Select(FriendState.getFriends) Friends: Observable<Friend[]>;
  constructor(private store:Store) { 
    this.store.dispatch(new GetFriends())
    
  }

  ngOnInit(): void {
    this.Friends.subscribe(x=>{
      console.log("burdaaa",x)
      this.users=x
    })
  }

}
