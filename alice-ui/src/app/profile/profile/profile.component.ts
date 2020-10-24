import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ProfilService } from '../profile.service';
import { UserModel } from 'src/app/models/user.model';
import { take } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

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
  isEditable: Boolean=false;
  userId: String = '';
  fileName:String;
  baseUrl: String;
  uploadUrl: String;
  imgHidden: Boolean = true;
  imgSrc: String;
  deleteOld:Boolean = false;
  currentPassword:String;
  password:String;
  passwordRepeat:String;
  passwordChangeAction:Boolean=false;
  
  constructor(private service: ProfilService, private _sanitizer: DomSanitizer,
    private imageCompress: NgxImageCompressService,
    private messageService: MessageService,
    private router: Router,
    private actRoute: ActivatedRoute) {
   
      this.actRoute.paramMap.subscribe(params => {
     
        if(params.get('id')){
          this.userId = params.get('id');
        }
             
      });

      this.baseUrl = environment.apiBaseUrl
      this.uploadUrl = this.baseUrl + "users/upload"

    this.User = new UserModel()
    this.editMode = false;
    this.service.getMyProfil(this.userId).subscribe(x => {
      if(localStorage.getItem('userId').replace("\"", "").replace("\"", "") == x._id){
        this.isEditable = true;
      }

      this.sellersPermitString = x.userPhoto
      this.User = x
      this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
        + this.sellersPermitString);
    })
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
        console.log("com:", compressedImage)

        var file = compressedImage
        console.log("files:", file)
        var pattern = /image-*/;
        var reader = new FileReader();
        console.log("type:  ", file)
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
        this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          + this.sellersPermitString);
      }

    })
  }


  rateUser(oy) {
    /* oy == 1 olumlu , ==2 olumsuz */
    this.messageService.add({ key: 'tc', severity: 'error', summary: 'Şimdi olmaz!', detail: 'Henüz oy verme yetkiniz yok' });
  }

  updateUser() {
    this.editMode = false;
    this.service.updateUser(this.User).subscribe(x => {
      if (x.status)
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Profiliniz Güncellendi!' });

    })

  }

  isPasswordValidation(){
    let isValid = true;
    if(this.currentPassword == null || this.currentPassword == "" ){
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Hata', detail: 'Şuanki şifre boş olamaz'  });
      isValid = false;
    }
    if(this.password == null || this.password == "" ){
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Hata', detail: 'Şifre boş olamaz'  });
      isValid = false;
    }
    if(this.passwordRepeat == null || this.passwordRepeat == "" ){
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Hata', detail: 'Şifre tekrarı boş olamaz'  });
      isValid = false;
    }
    if(this.passwordRepeat.trim() != this.password.trim()){
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Hata', detail: 'Şifreler eşleşmiyor'  });
      isValid = false;
    }

    return isValid
  }
  

  passwordChange(){
    if(this.isPasswordValidation()){
      this.service.savePassword(this.User.username,this.currentPassword,this.password,this.passwordRepeat).subscribe(x => {
        if (x){
          if(x.status)
            this.passwordChangeAction = false

          this.messageService.add({ key: 'tc', severity: x.toastType, summary: x.summary, detail:x.message });
        
        }
      })
    
    }
   
  }

  photoLinkCreate(link){
    if(link == null || link == "")
      link = "static/uploads/profile/empty_profile128.png";

    return this.baseUrl +link
  }
  onBasicUpload(element){
    if( this.deleteOld ){
   //   this.activityService.deleteFile(this.fileName);
    }
    this.fileName = element.originalEvent.body.photoLink
    this.imgHidden = false;
    this.imgSrc = "static/uploads/profile/"+this.fileName
    console.log(this.imgSrc)
    this.deleteOld = true;
    this.User.fileLink = this.imgSrc;
  }

}
