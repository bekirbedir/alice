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
          "previewImageSrc": "assets/activites/1.jpg",
          "thumbnailImageSrc": "assets/activites/1.jpg",
          "alt": "Description for Image 1",
          "title": "Title 1"
      },
 
      {
          "previewImageSrc":"assets/activites/2.jpg",
          "thumbnailImageSrc":"assets/activites/2.jpg",
          "alt": "Description for Image 2",
          "title": "Title 2"
      },
      {
          "previewImageSrc": "assets/activites/3.jpg",
          "thumbnailImageSrc":"assets/activites/3.jpg",
          "alt": "Description for Image 3",
          "title": "Title 3"
      },
      {
          "previewImageSrc": "assets/activites/4.jpg",
          "thumbnailImageSrc": "assets/activites/4.jpg",
          "alt": "Description for Image 4",
          "title": "Title 4"
      },
      {
          "previewImageSrc": "assets/activites/5.jpg",
          "thumbnailImageSrc":"assets/activites/5.jpg",
          "alt": "Description for Image 5",
          "title": "Title 5"
      }]
  }
}
 