import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/auth/user';
import { UserService } from 'src/app/users/user.service';
import { MessageService } from 'primeng/api';
import { SelectItem } from 'primeng/api';
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
  user: User
  tr:any
  cinsiyetler: SelectItem[];
  captchaCheck: Boolean= false;
  constructor(private router: Router, private registerservice: UserService, private messageService: MessageService) {
    this.user = new User();
  }

  ngOnInit(): void {
    this.tr = {
      firstDayOfWeek: 0,
      dayNames: [ "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi","Pazar"],
      dayNamesShort: ["Paz", "Pzt", "Sal", "ÇRŞ", "PRŞ", "CMA", "CTS"],
      dayNamesMin: ["PA", "PT", "SA", "ÇA", "PE", "CU", "PZ"],
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
  showResponse(response) {
    //call to a backend to verify against recaptcha with private key

    console.log('response', response)
    if(response){
      this.captchaCheck = true;
    }

  /*  this.registerservice.captchaControl(response).subscribe(x => {
      console.log('sdfsdfsds')
    }) */
}

  isValidate() {
    let isControl = true;

    if(!this.captchaCheck ){
      isControl = false;
      return isControl;
    }

    if (this.user.username == null || this.user.username == "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Kullanıcı Adı boş olamaz' });
      isControl = false;
    }
    if (this.user.password == null || this.user.password == "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Parola boş olamaz' });
      isControl = false;
    }

    if (this.user.email == null || this.user.email == "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Email boş olamaz' });
      isControl = false;
    }
    if (this.user.biography == null || this.user.biography == "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Biyograf Alanı boş olamaz' });
      isControl = false;
    }
    if (this.user.name == null || this.user.name == "") {
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
        console.log(x);
        this.checked = false
        if(x.status){
          this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Başarılı', detail: 'Kaydınız alındı. Mail adresinizi onaylayın lütfen' });
          this.mailOnayBilgisi = true;
          this.buttonEnabled = false;
          this.captchaCheck = false;
          this.user = new User();
        }
        else{
          this.messageService.add({ key: 'tc', severity: 'error', summary: 'Hata', detail: x.message });
        }
    
      })
    }
  }
 
}
