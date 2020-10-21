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
  sended :Boolean= false;

  ngOnInit(): void { 
    this.firstname,
    this.lastname,
    this.eMail,
    this.phone,
    this.comment
    
  }
  constructor(private router:Router,private communicationService: CommunicationService,private messageService: MessageService){
  }

  isValidate() {
    let isControl = true;
    if (this.firstname == null || this.firstname == "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Ad boş olamaz' });
      isControl = false;
    }
    if (this.lastname == null || this.lastname == "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Soyad boş olamaz' });
      isControl = false;
    }
    if (this.phone == null || this.phone == "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Telefon boş olamaz' });
      isControl = false;
    }

    if (this.comment == null || this.comment == "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Mesaj alanı boş olamaz' });
      isControl = false;
    }
   
    return isControl;
  }

  createInfo(){
    if(this.isValidate()){
    this.communicationService.createInfo("bekirbedir25@gmail.com",this.firstname,this.lastname,this.eMail,this.phone,this.comment).subscribe(x=>{
     if(x.status){
      this.messageService.add({key: 'tc', severity:'success', summary: 'Başarılı', detail:'Mesajınız alındı. En kısa sürede geri dönüş yapılacaktır.'});
      this.firstname = ''
      this.lastname= ''
      this.eMail= ''
      this.phone= ''
      this.comment= ''

      this.sended = true;
     }
    })
  }
  }
  showResponse(event){
    console.log(event.response);
    this.communicationService.showCaptchaResponse().subscribe(data => {
        console.log("Data: ",data)
    })

  }
}
