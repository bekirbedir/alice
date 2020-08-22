import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Activity } from 'src/app/models/activity';
import { LoginService } from 'src/app/auth/login.service';
import { NewActivityService } from '../new-activity.service';
import {MessageService} from 'primeng/api';


@Component({
  selector: 'app-new-activy',
  templateUrl: './new-activy.component.html',
  styleUrls: ['./new-activy.component.css'],
  providers:[MessageService]
})
export class NewActivyComponent implements OnInit {

  userName: "";
  password: "";
  email: "";
  bio = "";
  values: string[];
  name = "";
  version: string;
  msgs: any[];  
  checked: boolean = false;
  limitedParticipant: boolean = false;
  val=3;
  activity:Activity;
    
 
  constructor(private router:Router,private loginservice:LoginService,
    private activityService:NewActivityService,
    private messageService: MessageService) {
    this.activity =  new Activity();

   }

 
  ngOnInit(): void {
 


  }

  newActivity(){
    if(!this.limitedParticipant){
     this.activity.participationCount=0
    }
 
   this.activity.username=localStorage.getItem('userName').replace("\"", "").replace("\"", "") //local store koyup alabilirim veya dedıgım gıbı degısken yaratıp subscribe olurum
   this.activity.userId= localStorage.getItem('userId').replace("\"", "").replace("\"", "") 
   this.activity.tagList=this.values
   console.log(this.activity)
   this.activityService.addActivity(this.activity).subscribe(x=>{
     if(x){
      this.messageService.add({key: 'tc',severity:'success', summary:'Başarılı!', detail:'Aktivite başarı ile oluşturuldu. Admin onayından sonra yayına alınacaktır. İyi eğlenceler'});
     }
   })
  }
}
