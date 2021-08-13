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

  }
  onSelect(e) {
    
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
        this.activity.participationLimit = null
      }

      this.activity.username = localStorage.getItem('userName').replace("\"", "").replace("\"", "") //local store koyup alabilirim veya dedıgım gıbı degısken yaratıp subscribe olurum
      this.activity.userId = localStorage.getItem('userId').replace("\"", "").replace("\"", "")
      this.activity.tagList = this.tags;

      this.activityService.addActivity(this.activity).subscribe(x => {
        if (x) {
          this.activity = new Activity();
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Başarılı!', detail: 'Aktivite başarı ile oluşturuldu. İyi eğlenceler' });
          if(x.activityId){
            localStorage.setItem("selectedActivityId", x.activityId)
            this.router.navigate(['/activity-view/'+x.activityId])
          }
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

    this.deleteOld = true;
    this.activity.fileLink = this.fileName;
  }


}
