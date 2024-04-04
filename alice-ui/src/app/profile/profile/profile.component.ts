import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ProfilService } from '../profile.service';
import { UserModel } from 'src/app/models/user.model';
import { Activity } from 'src/app/models/activity';
import { take } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Store, Select } from '@ngxs/store';
import {
  GetActivityDetail,
} from 'src/app/store/actions/activity.action';
import { UserService } from 'src/app/users/user.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [MessageService]
})
export class ProfileComponent {
  imagePath: any
  User: any
  files: any
  loading: Boolean
  editMode: Boolean
  editPhone: Boolean
  isSendSms=false
  phoneDisable:Boolean = false;
  code=Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
  userCode:number
  isEditable: Boolean = false;
  userId: String = '';
  fileName: String;
  baseUrl: String;
  uploadUrl: String;
  imgHidden: Boolean = true;
  imgSrc: String;
  deleteOld: Boolean = false;
  currentPassword: String;
  password: String;
  tr:any;
  passwordRepeat: String;
  passwordChangeAction: Boolean = false;
  pictureFullScreen: Boolean = false;
  rateArea: Boolean = false;
  yourRate: number = 0;
  positiveRateCount: number = 0;
  negativeRateCount: number = 0;
  totalRateCount: number = 0;
  negativeRatePercent: any = "0"
  positiveRatePercent: any = "0"
  tempBirthDate:any;
  data: any;
  myActivities: Activity[];
  joinedActivities: Activity[];

  constructor(private service: ProfilService, private userService: UserService, private _sanitizer: DomSanitizer,
    private imageCompress: NgxImageCompressService,
    private messageService: MessageService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private store: Store) {

    this.yourRate = 0;
    this.baseUrl = environment.apiBaseUrl
    this.uploadUrl = this.baseUrl + "users/upload"

    this.User = new UserModel()
    this.editMode = false;
    this.editPhone = false;

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

    this.actRoute.paramMap.subscribe(params => {
      if (params.get('id')) {
        this.userId = params.get('id');
        this.service.getMyProfil(this.userId).subscribe(x => {
          if (localStorage.getItem('userId').replace("\"", "").replace("\"", "") == x._id) {
            this.isEditable = true;         
          } else {
            this.rateAccept();
          }
          this.votesInfos();
          this.joinActivityInfos();
          this.sellersPermitString = x.userPhoto;
          this.User = x;
          this.User.birthDate = new Date(x.birthDate);
          this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
            + this.sellersPermitString);
        })

        this.service.getMyActivities(this.userId).subscribe(x => {
          this.myActivities = x;
        })
        this.service.getMyJoinedActivities(this.userId).subscribe(x => {
          this.joinedActivities = x;
        })
      }

    });
    this.loading = false;
  }

  imageSrc;
  sellersPermitFile: any;
  DriversLicenseFile: any;
  InteriorPicFile: any;
  ExteriorPicFile: any;
  //base64s
  sellersPermitString: string;
  DriversLicenseString: string;
  InteriorPicString: string;
  ExteriorPicString: string;
  //json
  finalJson = {};
  imgResultBeforeCompress: string;
  imgResultAfterCompress: string;
  currentId: number = 0;
 
  rateAccept() {
    this.service.rateAccept(this.userId).subscribe(x => {
      if (x) {
        if (x.status)
          this.rateArea = true;
        this.yourRate = Number(x.summary);
      }
      else {
        this.rateArea = false;
      }
    })
  }

  votesInfos() {
    this.service.voteInfos(this.userId).subscribe(x => {
      if (x) {
        this.positiveRateCount = Number(x.positiveRateCount)
        this.negativeRateCount = Number(x.negativeRateCount)
        this.totalRateCount = Number(x.totalRateCount)
        this.voteGraphUpdate(this.yourRate);
      }
    })
  }

  voteGraphUpdate(votedBefore) {
    if (this.totalRateCount > 0) {
      //negative button ayarı
      if (this.negativeRateCount != 0 || isNaN(votedBefore) || votedBefore == 0) {
        let percent = ((this.negativeRateCount / this.totalRateCount) * 100).toFixed()
        this.negativeRatePercent = percent;
        document.getElementById('negative-bar').setAttribute('style', 'width:' + Number(percent) + '%');
      } else {
        document.getElementById('negative-bar').setAttribute('style', 'width:' + Number(0) + '%');
      }
      //positive button ayarı
      if (this.positiveRateCount != 0 || isNaN(votedBefore) || votedBefore == 0) {
        let percent = ((this.positiveRateCount / this.totalRateCount) * 100).toFixed()
        this.positiveRatePercent = percent;
        document.getElementById('positive-bar').setAttribute('style', 'width:' + Number(percent) + '%');
      } else {
        document.getElementById('positive-bar').setAttribute('style', 'width:' + Number(0) + '%');
      }
    }
  }

  rateUser(oy) {
    /* oy == 1 olumlu , ==2 olumsuz */
   /* if (this.yourRate > 0) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Oy değiştirilemez!', detail: 'Oy değiştirmek için yöneticiye başvurun' });
    } */
    var votedBefore = this.yourRate;
    if (!this.rateArea){
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Henüz oy verme yetkiniz yok!', detail: 'Oy vermek için birlikte 3 etkinliğe katılmanız gerekir' });
    }
    else {
      this.service.vote(this.userId, oy).subscribe(x => {
        if (x) {
          this.yourRate = oy;
          if(isNaN(votedBefore) || votedBefore == 0) this.totalRateCount++;
          if (oy == 1) {
            this.positiveRateCount++;
            if(votedBefore == 2 && this.negativeRateCount > 0) this.negativeRateCount--;
          } else {
            this.negativeRateCount++;
            if(votedBefore == 1 && this.positiveRateCount > 0) this.positiveRateCount--;
          }
          console.log(this.totalRateCount, this.positiveRateCount, this.negativeRateCount)
          this.voteGraphUpdate(votedBefore);
          this.messageService.add({ key: 'tc', severity: x.toastType, summary: x.summary, detail: x.message });
        }
      })
    }
  }

  joinActivityInfos() {
    /*
    katildi:katildi,
    katilmadi:katilmadi,
    reddedildi:reddedildi,
    istekgeriCekti:istekgeriCekti
    */
    this.service.joinActivityInfos(this.userId).subscribe(x => {
      if (x) {
        this.data = {
          labels: ['Katıldı', 'Katılmadı', 'Reddedildi'],
          datasets: [
            {
              data: [x.katildi, x.katilmadi, x.reddedildi],
              backgroundColor: [
                "#109e10",
                "#ec4634",
                "#198293"
              ],
              hoverBackgroundColor: [
                "#109e10",
                "#ec4634",
                "#198293"
              ]
            }]
        };
      }
    })
  }

  routeActivity(activityId) {
    this.store.dispatch(new GetActivityDetail(activityId))
    localStorage.setItem("selectedActivityId", activityId)
    this.router.navigate(['/activity-view/' + activityId]);
  }

  addPictures() {
    this.finalJson = {
      "sellersPermitFile": this.ExteriorPicString
    }
  }
  public picked(event, field) {
    this.loading = true;
    this.currentId = field;
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      if (field == 1) {
        this.sellersPermitFile = file;
        this.handleInputChange(file); //turn into base64
      }
    }
    else {
      alert("No file selected");
    }
  }

  handleInputChange(files) {
    this.service.compress(files)
      .pipe(take(1))
      .subscribe(compressedImage => {
        console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
        this.files = compressedImage;
        var file = compressedImage
        var pattern = /image-*/;
        var reader = new FileReader();
        if (!file.type.match(pattern)) {
          alert('invalid format');
          return;
        }
        reader.onloadend = this._handleReaderLoaded.bind(this);
        reader.readAsDataURL(file);
      })
  }

  _handleReaderLoaded(e) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(',') + 1);
    //this.imageSrc = base64result;
    this.sellersPermitString = base64result;
    const userId = localStorage.getItem('userId').replace("\"", "").replace("\"", "")
    this.service.updateUserPhoto(userId, this.sellersPermitString).subscribe(x => {
      if (x.status) {
        this.loading = false;
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Başarılı!', detail: 'Profil resmi değiştirildi.' });
        this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+ this.sellersPermitString);
      }
    })
  }
  update(event: Event) {
    //  this.data = //create new data
  }

  updateUser() {
    this.editMode = false;
    
    this.service.updateUser(this.User).subscribe(x => {
      if (x.status)
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Profiliniz Güncellendi!' });
    })
  }

  isPasswordValidation() {
    let isValid = true;
    if (this.currentPassword == null || this.currentPassword == "") {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Hata', detail: 'Şuanki şifre boş olamaz' });
      isValid = false;
    }
    if (this.password == null || this.password == "") {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Hata', detail: 'Şifre boş olamaz' });
      isValid = false;
    }
    if (this.passwordRepeat == null || this.passwordRepeat == "") {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Hata', detail: 'Şifre tekrarı boş olamaz' });
      isValid = false;
    }
    if (this.passwordRepeat.trim() != this.password.trim()) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Hata', detail: 'Şifreler eşleşmiyor' });
      isValid = false;
    }
    return isValid
  }

  passwordChange() {
    if (this.isPasswordValidation()) {
      this.service.savePassword(this.User.username, this.currentPassword, this.password, this.passwordRepeat).subscribe(x => {
        if (x) {
          if (x.status)
            this.passwordChangeAction = false

          this.messageService.add({ key: 'tc', severity: x.toastType, summary: x.summary, detail: x.message });
        }
      })
    }
  }

  sendSms(){
    if(this.User.phone==undefined || null || this.User.phone.length !=14){
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail:'Eksik veya hatalı bir numara' });
      return
    }
    this.userService.postSmsCode(this.User.phone,this.code).subscribe(x=>{
      if(x.status==true){
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Sms Gönderildi', detail:'Telefonuna gelen sms onay kodunu ilgili alana yaz lütfen' });
        this.phoneDisable = true;
        this.isSendSms=true 
      }
      else{
        this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: x.message });
        this.isSendSms=false
      }
    })
  }

  savePhone(){
    if (this.code*2-1428 != this.userCode ) {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Sms onay kodunuz doğru değil' });
    } else{
      this.service.updateUser(this.User).subscribe(x => {
        if (x.status)
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Telefon Numaranız Güncellendi!' });
          this.editPhone = false;
      })
    }
  }

  handleCancel(){
    this.editPhone=false;
  }

  photoLinkCreate(link) {
    if (link == null || link == "")
      link = "static/uploads/profile/empty_profile128.png";

    return this.baseUrl + link
  }

  onBasicUpload(element) {
    if (this.deleteOld) {
      //   this.activityService.deleteFile(this.fileName);
    }
    this.fileName = element.originalEvent.body.photoLink
    this.imgHidden = false;
    this.imgSrc = "static/uploads/profile/" + this.fileName
    console.log(this.imgSrc)
    this.deleteOld = true;
    this.User.fileLink = this.imgSrc;
    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Profil Fotoğrafı Güncellendi!' });
  }
}
