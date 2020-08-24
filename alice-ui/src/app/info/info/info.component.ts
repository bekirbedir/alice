import { Component, OnInit } from '@angular/core';
import {GalleriaModule} from 'primeng/galleria';

@Component({
  selector: 'app-profile',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})

export class InfoComponent implements OnInit {
  images: any[];

  responsiveOptions:any[] = [
      {
          breakpoint: '1024px',
          numVisible: 5
      },
      {
          breakpoint: '768px',
          numVisible: 3
      },
      {
          breakpoint: '560px',
          numVisible: 1
      }
  ];
  constructor() { }

  ngOnInit(): void {
      this.images = ["https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQlQuoX6AclVPxdbRS6yFpkF_cajR0X8uZUow&usqp=CAU"]
  }

}
