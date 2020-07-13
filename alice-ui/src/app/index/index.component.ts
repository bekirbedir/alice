import { Component, ViewChild, OnInit } from '@angular/core';
import {TabMenuModule} from 'primeng/tabmenu';
import {MenuItem} from 'primeng/api'
import {MenubarModule} from 'primeng/menubar';
import { LoginService } from '../auth/login.service';



@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor(private loginservice:LoginService){

  }

  closeItem(event, index) {
    this.items = this.items.filter((item, i) => i !== index);
    event.preventDefault();
}
    
  items: MenuItem[];
    
  activeItem: MenuItem;
  
  ngOnInit() {
    
      this.items = [
          {label: 'Aktiviteler', icon: 'pi pi-fw pi-home', routerLink:'activities'},  
          {label: 'Arkadaşlar', icon: 'pi pi-fw pi-calendar',routerLink:'users'},
          {label: 'İletişim', icon: 'pi pi-fw pi-pencil',routerLink:'communication'},
          {label: 'Biz Kimiz ?', icon: 'pi pi-fw pi-file'},
          {label: 'Giriş Yap', icon: 'pi pi-sign-in', routerLink:'login' },
          {label: 'Kayıt Ol', icon: 'pi pi-user-plus'},
          {label: 'Profilim', icon: 'pi pi-user-plus',routerLink:'profile'}
      ];

      this.activeItem = this.items[0];
  }
  LogOut(){
   this.loginservice.logout()
  }
}
