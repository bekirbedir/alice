import { Component, OnInit } from '@angular/core';

import { Socket } from 'ng-socket-io';
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'app-message-user',
  templateUrl: './message-user.component.html',
  styleUrls: ['./message-user.component.css']
})
export class MessageUserComponent implements OnInit {
  ngOnInit(): void {

  }


  title = 'app';
  
  userId: string;
  username: string;
  isActive=false


  constructor() {


    const aliceuser = JSON.parse(localStorage.getItem('aliceuser'));
    if(aliceuser!=null){
      console.log("user true oldu")
      this.isActive=true
    }

 
  }




}
