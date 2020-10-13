import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Activity } from 'src/app/models/activity';
import { LoginService } from 'src/app/auth/login.service';
import { NewActivityService } from '../new-activity.service';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';


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
  tags: string[];
  name = "";
  version: string;
  msgs: any[];
  uploadedFiles: File[] ;
  checked: boolean = false;
  limitedParticipant: boolean = false;
  val = 3;
  activity: Activity;
  imgHidden: Boolean = true;
  imgSrc: String;
  deleteOld:Boolean = false;
  fileName:String;
  baseUrl: String;
  uploadUrl: String;

  constructor(private router: Router, private loginservice: LoginService,
    private activityService: NewActivityService,
    private messageService: MessageService) {
    this.activity = new Activity();
    this.baseUrl = environment.apiBaseUrl
    this.uploadUrl = this.baseUrl + "activity/upload"
    this.activity.fileLink =  "empty_activity.jpg";
    this.imgSrc = this.baseUrl+"static/uploads/"+this.activity.fileLink

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
      this.activity.tagList = this.tags;
      console.log("activity", this.activity);
      this.activityService.addActivity(this.activity).subscribe(x => {
        if (x) {
          this.activity = new Activity();
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Başarılı!', detail: 'Aktivite başarı ile oluşturuldu. Admin onayından sonra yayına alınacaktır. İyi eğlenceler' });
        }
      })
    }
  }

  onBasicUpload(element){
    if( this.deleteOld ){
      this.activityService.deleteFile(this.fileName);
    }
    this.fileName = element.originalEvent.body.photoLink
    this.imgHidden = false;
    this.imgSrc = this.baseUrl+"static/uploads/"+this.fileName
    console.log(this.imgSrc)
    this.deleteOld = true;
    this.activity.fileLink = this.fileName;
  }


}
