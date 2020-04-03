import { Component } from '@angular/core';
import { AuthService } from '@shared';
import { AlertService } from '@shared';
import { R3TargetBinder } from '@angular/compiler';

@Component({
  selector: 'app-edit-feature',
  templateUrl: 'edit-feature.component.html',
  styleUrls: ['./edit-feature.component.css']
})
export class EditFeatureComponent  {

  photofeature = []
  constructor(public authService: AuthService,
    private alertService: AlertService,) { }

  ngOnInit() {
    console.log('hello');
  }

  addphoto(){
    var x = {localurl:'', description: '', file: undefined}
    this.photofeature.push(x)
  }
  attached(event){
    event.target.files[0];
  }



}
