import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Activity } from 'src/app/models/activity';
import { LoginService } from 'src/app/auth/login.service';
import { NewActivityService } from '../new-activity.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-new-activy',
  templateUrl: './new-activy.component.html',
  styleUrls: ['./new-activy.component.css'],
  providers: [MessageService]
})
export class NewActivyComponent implements OnInit {
  tr: any;
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
  val = 3;
  activity: Activity;


  constructor(private router: Router, private loginservice: LoginService,
    private activityService: NewActivityService,
    private messageService: MessageService) {
    this.activity = new Activity();

  }


  ngOnInit(): void {

    this.tr = {
      firstDayOfWeek: 0,
      dayNames: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
      dayNamesShort: ["Paz", "Pzt", "Sal", "ÇRŞ", "PRŞ", "CMA", "CTS"],
      dayNamesMin: ["PA", "PT", "SA", "ÇA", "PE", "CU", "PZ"],
      monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      today: 'Today',
      clear: 'Clear',
      dateFormat: 'dd.mm.yy',
      weekHeader: 'Wk'
    };

  }
  onSelect(e) {
    console.log("------------- on select");
  }

  isValidate() {
    let isControl = true;
    if (this.activity.header == null || this.activity.header == "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Aktivite başlığı boş olamaz' });
      isControl = false;
    }
    if (this.activity.context == null || this.activity.context == "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Detay vermeden olur mu hiç :(' });
      isControl = false;
    }

    return isControl;
  }



  newActivity() {
    if (this.isValidate()) {
      if (!this.limitedParticipant) {
        this.activity.participationCount = 0
      }

      this.activity.username = localStorage.getItem('userName').replace("\"", "").replace("\"", "") //local store koyup alabilirim veya dedıgım gıbı degısken yaratıp subscribe olurum
      this.activity.userId = localStorage.getItem('userId').replace("\"", "").replace("\"", "")
      this.activity.tagList = this.values
      this.activityService.addActivity(this.activity).subscribe(x => {
        if (x) {
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Başarılı!', detail: 'Aktivite başarı ile oluşturuldu. Admin onayından sonra yayına alınacaktır. İyi eğlenceler' });
        }
      })
    }
  }
}
