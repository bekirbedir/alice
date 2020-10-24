import { Component, ViewChild, OnInit, AfterContentChecked, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import {TabMenuModule} from 'primeng/tabmenu';
import {MenuItem} from 'primeng/api'
import {MenubarModule} from 'primeng/menubar';
import { LoginService } from '../auth/login.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements   OnInit{
  isActiveUser:string
  currentUserName:string;
  isLogin : Boolean;
  notificationCount: any =0;
  constructor(private loginservice:LoginService,private router:Router){
   this.isLogin = false;

  this.isActiveUser=localStorage.getItem("aliceuser")
  this.currentUserName=JSON.parse(localStorage.getItem("userName"));
  
  if(this.isActiveUser){
    loginservice.notificationCount().subscribe(x=>{
      this.notificationCount = x;
    });
    var countInterval = setInterval(()=>{    
    loginservice.notificationCount().subscribe(x=>{
      this.notificationCount = x;
    });
   },15000)
  }



  }

  

  closeItem(event, index) {
    this.items = this.items.filter((item, i) => i !== index);
    event.preventDefault();
}
    
  items: MenuItem[];
    
  activeItem: MenuItem;
  


  ngOnInit() {

    try{
      this.loginservice.user$.subscribe(x=>{
        
      })
    }catch(error){
      
    }
    
    if(this.isActiveUser){
      this.isLogin = true;
   //   this.activeItem = this.items[0];
    }
    else{

        this.isLogin = false;
      this.items = [
        {label: 'Aktiviteler', icon: 'pi pi-fw pi-home', routerLink:'activities'}, 
        {label: 'Biz Kimiz ?', icon: 'pi pi-fw pi-file',routerLink:'info'},
        {label: 'İletişim', icon: 'pi pi-fw pi-pencil',routerLink:'communication'},
        {label: 'Mesajlaşma', icon: 'pi pi-fw pi-pencil',routerLink:'messages'},
        {label: 'Giriş Yap', icon: 'pi pi-sign-in', routerLink:'login' },
    ];

    this.activeItem = this.items[0];
    }

     
  }


  LogOut(){
   this.loginservice.logout()
   this.isLogin = false;
   this.items = [
     {label: 'Aktiviteler', icon: 'pi pi-fw pi-home', routerLink:'activities'}, 
     {label: 'Biz Kimiz ?', icon: 'pi pi-fw pi-file',routerLink:'info'},
     {label: 'İletişim', icon: 'pi pi-fw pi-pencil',routerLink:'communication'},
     {label: 'Mesajlaşma', icon: 'pi pi-fw pi-pencil',routerLink:'messages'},
     {label: 'Giriş Yap', icon: 'pi pi-sign-in', routerLink:'login' },
 ];
 this.activeItem = this.items[0];
 window.location.reload();
  }
  routeProfile(){
    const userId = localStorage.getItem('userId').replace("\"", "").replace("\"", "");
    this.router.navigate(['/profile/'+userId])
   }
  
}
