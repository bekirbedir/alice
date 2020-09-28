import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {NgxImageCompressService} from 'ngx-image-compress';
import { ProfilService } from '../profile.service';
import { UserModel } from 'src/app/models/user.model';
import { take } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [MessageService]
})
export class ProfileComponent  {
  imagePath:any
  User:any
  files:any
  loading:Boolean
  constructor( private service:ProfilService,private _sanitizer: DomSanitizer,
    private imageCompress: NgxImageCompressService,
    private messageService: MessageService){
    const userId=localStorage.getItem('userId').replace("\"", "").replace("\"", "") 
    this.User=new UserModel()
    this.service.getMyProfil(userId).subscribe(x=>{
      this.sellersPermitString=x.userPhoto
      this.User=x
    this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
    +this.sellersPermitString );
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
  imgResultBeforeCompress:string;
  imgResultAfterCompress:string;
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
       console.log("com:",compressedImage)

       var file=compressedImage
       console.log("files:",file)
       var pattern = /image-*/;
       var reader = new FileReader();
       console.log("type:  ",file)
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
  const userId=localStorage.getItem('userId').replace("\"", "").replace("\"", "") 
    this.service.updateUserPhoto(userId,this.sellersPermitString).subscribe(x=>{
      if(x.status){
        this.loading = false;
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Başarılı!', detail: 'Profil resmi değiştirildi.' });
      this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
       +this.sellersPermitString );
      }
        
    })
  }


  rateUser(oy){
    /* oy == 1 olumlu , ==2 olumsuz */
    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Oy verdiniz!', detail: 'Henüz yapım aşamasında' });
  }
 

 

}
