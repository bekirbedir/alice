import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import {InputTextModule} from 'primeng/inputtext';
import { Router } from '@angular/router';
import { CommunicationService } from 'src/app/communication/communication.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.css'],
  providers: [MessageService]
})
export class CommunicationComponent implements OnInit {
  firstname: "";
  lastname: "";
  eMail: "";
  phone: "";
  comment: "";

  ngOnInit(): void { 
    this.firstname,
    this.lastname,
    this.eMail,
    this.phone,
    this.comment
    
  }
  constructor(private router:Router,private communicationService: CommunicationService,private messageService: MessageService){
  }

  createInfo(){
    console.log ("dsfsdfsd")
    this.communicationService.createInfo("bekirbedir25@gmail.com",this.firstname,this.lastname,this.eMail,this.phone,this.comment).subscribe(x=>{
     if(x.status){
      this.messageService.add({key: 'tc', severity:'success', summary: 'Başarılı', detail:'Mesajınız alındı. En kısa sürede geri dönüş yapılacaktır.'});
      this.firstname = ''
      this.lastname= ''
      this.eMail= ''
      this.phone= ''
      this.comment= ''
     }
    })
  }
  showResponse(){
    this.communicationService.showCaptchaResponse().subscribe(data => {
        console.log("Data: ",data)
    })

  }
}
