import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/auth/user';
import { UserService } from 'src/app/users/user.service';
import { MessageService } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [MessageService]
})
export class SignupComponent implements OnInit {

  version: string;
  msgs: any[];
  checked: boolean = false;
  mailOnayBilgisi:Boolean = false;
  buttonEnabled:Boolean = true;
  buttonSmsValid=false;
  user: User
  sozlesmeVisible: Boolean = false;
  tr:any
  isSendSms=false
  cinsiyetler: SelectItem[];
  captchaCheck: Boolean= false;
  code=Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
  userCode:number
  constructor(private http: HttpClient,private router: Router, private registerservice: UserService, private messageService: MessageService) {
    console.log("intial edildi")
    this.user = new User();
  }

  ngOnInit(): void {
    this.tr = {
      firstDayOfWeek: 1,
      dayNames: [ "Pazar","Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
      dayNamesShort: ["Pzr","Pzt", "Sal", "Çrş", "Prş", "Cma", "Cts"],
      dayNamesMin: ["PZ","PT", "SA", "ÇA", "PE", "CU", "CT"],
      monthNames: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
      monthNamesShort: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Temm", "Agu", "Eyl", "Eki", "Kas", "Ara"],
      today: 'Bugün',
      clear: 'Temizle',
      dateFormat: 'dd.mm.yy',
      weekHeader: 'Wk'
    };
    this.cinsiyetler = [{label: 'Erkek', value: 'Erkek'}, {label: 'Kadın', value: 'Kadın'}];

  }
  routeLogin() {
    this.router.navigate(['/login'])
  }
  showDialog() {
    this.sozlesmeVisible = true;
}
  showResponse(response) {
    //call to a backend to verify against recaptcha with private key

    if(response){
      this.captchaCheck = true;
    }

  /*  this.registerservice.captchaControl(response).subscribe(x => {
    
    }) */
}

sendSms(){

  if(this.user.phone==undefined || null || this.user.phone.length !=14){
    this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail:'Eksik veya hatalı bir numara' });
    return
  }
  this.registerservice.postSmsCode(this.user.phone,this.code).subscribe(x=>{
    if(x.status==true){
      this.messageService.add({ key: 'tc', severity: 'success', summary: 'Harika :)', detail:'Telefonuna gelen sms onay kodunu ilgili alana yaz lütfen' });
      this.isSendSms=true 
    }
    else{
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: x.message });
      this.isSendSms=false
    }
  })
}
  isValidate() {
    let isControl = true;

  /*  if(!this.captchaCheck ){
       isControl = false;
       return isControl;
    } */

    if (this.user.username == null || this.user.username.trim() == "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Kullanıcı Adı boş olamaz' });
      isControl = false;
    }
    if (this.user.password == null || this.user.password.trim() == "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Parola boş olamaz' });
      isControl = false;
    }

    if (this.user.email == null || this.user.email.trim() == "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Email boş olamaz' });
      isControl = false;
    }
    if (this.user.biography == null || this.user.biography.trim() == "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Biyograf Alanı boş olamaz' });
      isControl = false;
    }
    if (this.user.name == null || this.user.name.trim() == "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Ad boş olamaz' });
      isControl = false;
    }
    if (this.user.gender == null || this.user.gender == "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Cinsiyet boş olamaz' });
      isControl = false;
    }
    if (this.user.birthDate == null) {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Doğum günü boş' });
      isControl = false;
    }
    if (this.code*2-1428 != this.userCode ) {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Sms onay kodunuz doğru değil' });
      isControl = false;
    }
    if (this.user.phone == null || this.user.phone == "") {
    
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Telefon Numarası Boş olamaz' });
      isControl = false;
    }else{
   
      let phoneNumber=this.user.phone;
     
      phoneNumber = phoneNumber.replace(" ", "").replace("(", "").replace(")", "").replace("-", "");

      if (phoneNumber== null || phoneNumber == ""){
        this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Telefon Numarası Boş olamaz' });
        isControl = false;
      }
     
    }
    return isControl;
  }

  createNewUser() {
    if (this.isValidate()) {
      this.registerservice.creatUser(this.user).subscribe(x => {
        
        this.checked = false
        if(x.status){
          this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Başarılı', detail: 'Kaydınız alındı. Mail adresinizi onaylayın lütfen' });
          this.mailOnayBilgisi = true;
          this.buttonEnabled = false;
          this.captchaCheck = false;
          this.user = new User();
          this.userCode=null
          
        }
        else{
          this.messageService.add({ key: 'tc', severity: 'error', summary: 'Hata', detail: x.message });
        }
    
      })
    }
  }



 
}
