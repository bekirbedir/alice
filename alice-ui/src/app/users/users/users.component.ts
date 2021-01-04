import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { UserService } from '../user.service'
import { Router, ActivatedRoute } from '@angular/router';
import { UserModel } from '../../models/user.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users:UserModel[]
  search:string = "";

  constructor(private store:Store,private router: Router, private service: UserService ) { 
    
    
  }

  ngOnInit(): void {
    this.searchUser('')
  }

  routeProfile(userId) {
    this.router.navigate(['/profile/' + userId])
  }

  searchUser(word:string) {
    this.service.allUsers(word).subscribe(x => {
      if (x) {
       this.users = x;
      }

    })
  }

  photoLinkCreate(link) {
    if (link == null || link == "")
      link = "static/uploads/profile/empty_profile128.png";

    return environment.apiBaseUrl + link
  }

  searchFilter(e){
    if(this.search.trim() == '' || this.search.trim() == null)
      return false;
    else
      this.searchUser(this.search)
  }

}
