import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import * as $ from 'jquery';
import { AuthService, AlertService, UserService, FileService } from '@shared';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import { ClientService } from '@shared/services/client.service';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
  animations: [
    trigger('imageAnimation', [

      state('small', style({
        transform: 'scale(1)',
      })),
      state('large', style({
        transform: 'scale(2)',
      })),

      transition('small <=> large', animate('500ms ease-in', keyframes([
        style({opacity: 0, transform: 'translateY(-80%)', offset: 0}),
        style({opacity: 1, transform: 'translateY(25px)', offset: 1})
      ]))),
    ]),
  ]
})
export class ProfileSettingsComponent implements OnInit {
  public uid = sessionStorage.getItem('session-user-uid');
  public displayName = 'Your username';
  public bio: any = 'Your bio';
  public state = 'small';
  profileTitle: any;
  username: any;
  email: any;
  profiledetails: any;
  viewClientForm: any;
  fullImagePath: string;
  profpicfile: any;
  projectSub: Subscription;
  clientid: any;
  public upload_perc: Observable<number>;
  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private userService: UserService,
    private db: AngularFirestore, public fb: FormBuilder,
    public fileservice: FileService,
    public clientservice: ClientService,
    private router: Router,
  ) {
    this.viewClientForm = this.fb.group({
      firstName: [''],
        lastName: [''],
        fullName: [''],
        userName: [''],
        contactNumber: [''],
        addressCity: [''],
        addressRegion: [''],
        uid: ['']
    });
  }

  public ngOnInit() {

    console.log(this.uid)
    this.projectSub = this.db.collection('client', ref => ref.where('uid', '==', this.uid)).snapshotChanges().subscribe(async r => {
      var result = r[0].payload.doc.data();
      this.clientid = r[0].payload.doc.id;
      console.log(result);
      this.profileTitle = result['fullName']
      this.username = result['userName']
      this.email = result['email']
      //this.bio = snap.val().bio
      this.profiledetails = result;


      this.viewClientForm = this.fb.group({
        firstName: [this.profiledetails.firstName],
        lastName: [this.profiledetails.lastName],
        fullName: [this.profiledetails.firstName + ' ' + this.profiledetails.lastName],
        userName: [this.profiledetails.userName],
        contactNumber: [this.profiledetails.contactNumber],
        addressCity: [this.profiledetails.addressCity],
        addressRegion: [this.profiledetails.addressRegion],
        uid: [this.profiledetails.uid]
      })

      if (!this.profiledetails.photoURL || this.profiledetails.photoURL === '') {
        console.log('blank')
        this.fullImagePath = '/assets/img/mb-bg-04.png'
      } else {
        this.fullImagePath = this.profiledetails.photoURL.photoURL
      }

      console.log(result)
    })
    return this.projectSub

  }

  public animateImage(): void {
    this.state = (this.state === 'small' ? 'large' : 'small');
  }

  hoverimage() {
    $('.changeprofpicdiv').css('display', 'block');
  }
  hoveroutimage() {
    if (!this.profpicfile) {
      $('.changeprofpicdiv').css('display', 'none');
    }
  }
  tochangepic() {
    $('#profpic').click();
  }
  changingpicfile(event) {
    this.profpicfile = event.target.files[0];
    if (this.profpicfile) {
      var reader = new FileReader();
      reader.onload = (event1: any) => {
        //console.log(event.target.result);
        this.fullImagePath = event1.target.result
      }

      reader.readAsDataURL(this.profpicfile);

      $('.changeprofpic').addClass('btn-success');
    }
    else {
      $('.changeprofpic').addClass('btn-primary');
    }

  }
  public async save() {
    if (this.viewClientForm.valid) {
      $('#savebutton').attr('disabled', true);
      var x;
      if (this.profpicfile) {
        const path = `project/storeFile${new Date().getTime()}_${this.profpicfile.name}`;
        console.log(this)
         var fileprop = await this.fileservice.upload_in_storage_percent(path, this.profpicfile, this.uid, 'client',this);
        //var fileprop = await this.fileservice.upload_in_storage(path, this.profpicfile, this.uid, 'client');
        x = {id : fileprop['id'],photoURL: fileprop['photoURL'] };
      }
      console.log(this.viewClientForm.value);
      console.log(this.clientid);
      this.clientservice.updateClient(this.clientid,this.viewClientForm.value,x);
      this.alertService.showToaster('Your settings are saved');

    }
  }
  public onPasswordReset(): void {
    this.userService.sendUserPasswordResetEmail();
    this.alertService.showToaster('Reset password is sent to your email');
  }

}
