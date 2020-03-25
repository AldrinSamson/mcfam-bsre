import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthService, AlertService } from '../../shared';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styles: [`
  button {
    position: fixed;
    bottom: 70px;
    float: right;
    right: 10px;
    z-index: 10;
  }`]
})

export class HomeComponent {
  
  public isAuthenticated: string;

  constructor(
    public authService: AuthService,
    private alertService: AlertService,
    ) {
      this.isAuthenticated = this.authService.isAuthenticated()
  }

  public onToTop(): void {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
  
  featuredCarousel: OwlOptions = {
    loop: true,
    margin: -1,
    items: 1,
    nav: true,
    navText: ['<i class="ion-ios-arrow-back" aria-hidden="true"></i>', '<i class="ion-ios-arrow-forward" aria-hidden="true"></i>'],
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true
  }

  propertyCarousel: OwlOptions = {
    loop: true,
    margin: 30,
    responsive: {
      0: {
        items: 1,
      },
      769: {
        items: 2,
      },
      992: {
        items: 3,
      }
    }
  }

  slidesStore = [
    {
      id:1,
      src:'https://i.picsum.photos/id/976/400/250.jpg',
      alt:'Image_1',
      title:'Image_1'
    },
    {
      id:2,
      src:'https://i.picsum.photos/id/996/400/250.jpg',
      alt:'Image_2',
      title:'Image_3'
    },
    {
      id:3,
      src:'https://i.picsum.photos/id/400/400/250.jpg',
      alt:'Image_3',
      title:'Image_3'
    },
    {
      id:4,
      src:'https://i.picsum.photos/id/316/400/250.jpg',
      alt:'Image_4',
      title:'Image_4'
    },
    {
      id:5,
      src:'https://i.picsum.photos/id/705/400/250.jpg',
      alt:'Image_5',
      title:'Image_5'
    }
  ]

}
