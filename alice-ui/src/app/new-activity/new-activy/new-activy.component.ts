import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Activity } from 'src/app/models/activity';


@Component({
  selector: 'app-new-activy',
  templateUrl: './new-activy.component.html',
  styleUrls: ['./new-activy.component.css']
})
export class NewActivyComponent implements OnInit {

  userName: "";
  password: "";
  email: "";
  bio = "";
  name = "";
  version: string;
  msgs: any[];  
  checked: boolean = false;
  limitedParticipant: boolean = false;
  val=3;
  activity:Activity;
    
 
  constructor(private router:Router) {
    this.activity =  new Activity();
   }


  ngOnInit(): void {
 


  }

}
