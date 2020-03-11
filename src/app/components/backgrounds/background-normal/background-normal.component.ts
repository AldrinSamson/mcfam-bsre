import { Component } from '@angular/core';

@Component({
  selector: 'app-background-normal',
  template: `
  <div class="background">
    <img [src]="fullImagePath">
  </div>
`,
  styles: [
    `.background img {
      position: relative;
      width: 100%;
      max-height: 300px;
      margin: 0 auto;
      z-index: 1;
      box-shadow: 2px 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);
    }`
  ]
})
export class BackgroundNormalComponent {
  public fullImagePath: string = '/assets/img/mb-bg-06.png';
}
