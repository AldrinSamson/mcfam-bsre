import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { MatDialog, MatDialogRef , MatDialogConfig , MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as firebase from 'firebase';

import { UserService, AlertService } from '@shared';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [
    trigger('imageAnimation', [

      state('small', style({
        transform: 'scale(1)',
      })),
      state('large', style({
        transform: 'scale(2)',
      })),

      transition('small <=> large', animate('500ms ease-in', keyframes([
        style({ opacity: 0, transform: 'translateY(-80%)', offset: 0 }),
        style({ opacity: 1, transform: 'translateY(25px)', offset: 1 })
      ]))),
    ]),
  ]
})
export class ProfileComponent implements OnInit {
  public uid = sessionStorage.getItem('session-user-uid');

  public fullImagePath: string = '/assets/img/mb-bg-04.png';
  public profileTitle: string = '';
  public username: string = '';
  public bio: any = 'Your bio';
  public email: string;
  public state: string = 'small';
  public profiledetails: any;
  public viewClientForm: any;
  constructor(
    private userService: UserService,
    private alertService: AlertService, private db: AngularFirestore, 
    public fb: FormBuilder,
    ) { }

  public ngOnInit(): Promise<void> {

    console.log(this.uid)

    return this.db.collection('client', ref => ref.where('uid', '==', this.uid)).valueChanges().forEach(result => {
      this.profileTitle = result[0]['fullName']
      this.username = result[0]['userName']
      this.email = result[0]['email']
      //this.bio = snap.val().bio
      this.profiledetails = result[0];


      this.viewClientForm = this.fb.group({
        firstName: [{value: this.profiledetails.firstName , readOnly:true}],
        lastName: [this.profiledetails.lastName],
        fullName: [this.profiledetails.firstName +' '+ this.profiledetails.lastName],
        userName: [this.profiledetails.userName],
        contactNumber: [this.profiledetails.contactNumber],
        // addressStreet: [this.profiledetails.addressStreet],
        // addressTown: [this.profiledetails.addressTown],
        addressCity: [this.profiledetails.addressCity],
        addressRegion: [this.profiledetails.addressRegion],
        uid: [this.profiledetails.uid] 
      })

      if(!this.profiledetails.photoURL|| this.profiledetails.photoURL===''){
        console.log('blank')
        this.fullImagePath = '/assets/img/mb-bg-04.png'
      }else{
        this.fullImagePath = this.profiledetails.photoURL.photoURL
      }

      console.log(result)
    })


  }

  public animateImage(): void {
    this.state = (this.state === 'small' ? 'large' : 'small');
  }

  public userEmail(): void {
    //this.userService.getUserProfileInformation();
    //firebase.auth().currentUser.email;
  }

  public onPasswordReset(): void {
    //this.userService.sendUserPasswordResetEmail();
    //this.alertService.showToaster('Reset password is sent to your email');
  }

  hoverimage() {
    console.log('hovered');
  }

}
