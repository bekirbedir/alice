import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {



  images: any[];
        
  constructor() { }

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
  ngOnInit() {
    this.images=[
      {
          "previewImageSrc": "assets/activites/1.jpeg",
          "thumbnailImageSrc": "assets/activites/1.jpeg",
          "alt": "Description for Image 1",
          "title": "Title 1"
      },
 
      {
          "previewImageSrc":"assets/activites/2.jpeg",
          "thumbnailImageSrc":"assets/activites/2.jpeg",
          "alt": "Description for Image 2",
          "title": "Title 2"
      },
      {
          "previewImageSrc": "assets/activites/3.jpeg",
          "thumbnailImageSrc":"assets/activites/3.jpeg",
          "alt": "Description for Image 3",
          "title": "Title 3"
      },
      {
        "previewImageSrc": "assets/activites/6.jpeg",
        "thumbnailImageSrc":"assets/activites/6.jpeg",
        "alt": "Description for Image 6",
        "title": "Title 6"
    }]
  }
}
 