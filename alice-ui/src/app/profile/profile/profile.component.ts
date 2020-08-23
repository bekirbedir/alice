import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {NgxImageCompressService} from 'ngx-image-compress';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent  {
  imagePath:any

 
  constructor( private _sanitizer: DomSanitizer,private imageCompress: NgxImageCompressService){

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
      "sellersPermitFile": this.ExteriorPicString,
      "DriversLicenseFile": this.DriversLicenseString,
      "InteriorPicFile": this.InteriorPicString,
      "ExteriorPicFile": this.ExteriorPicString
    }
  }
  public picked(event, field) {
    this.currentId = field;
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      if (field == 1) {
        this.sellersPermitFile = file;
        this.handleInputChange(file); //turn into base64
      }
      else if (field == 2) {
        this.DriversLicenseFile = file;
        this.handleInputChange(file); //turn into base64
      }
      else if (field == 3) {
        this.InteriorPicFile = file;
        this.handleInputChange(file); //turn into base64
      }
      else if (field == 4) {
        this.ExteriorPicFile = file;
        this.handleInputChange(file); //turn into base64

      }
    }
    else {
      alert("No file selected");
    }
  }


  handleInputChange(files) {
    var file = files;
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(',') + 1);
    //this.imageSrc = base64result;
    let id = this.currentId;
    switch (id) {
      case 1:
        this.sellersPermitString = base64result;
        break;
      case 2:
        this.DriversLicenseString = base64result;
        break;
      case 3:
        this.InteriorPicString = base64result;
        break;
      case 4:
        this.ExteriorPicString = base64result;
        break
    }

    this.log();
 
    
    this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
    +this.sellersPermitString );
  }

  log() { 
    // for debug
    console.log('base 64', this.sellersPermitString);
  }

 

}
