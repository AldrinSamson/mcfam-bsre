import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as firebase from 'firebase';
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
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {
  public uid = sessionStorage.getItem('session-user-uid');;
  public displayName: string = 'Your username';
  public bio: any = 'Your bio';
  profileTitle: any;
  username: any;
  email: any;
  profiledetails: any;
  viewClientForm: any;
  fullImagePath: string;
  profpicfile: any;
  projectSub: Subscription;
  clientid: any;
  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private userService: UserService,
    private db: AngularFirestore, public fb: FormBuilder,
    public fileservice: FileService,
    public clientservice: ClientService,
    private router: Router,
  ) {
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
        // addressStreet: [this.profiledetails.addressStreet],
        // addressTown: [this.profiledetails.addressTown],
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
      var x;
      if (this.profpicfile) {
        const path = `project/storeFile${new Date().getTime()}_${this.profpicfile.name}`;
        var fileprop = await this.fileservice.upload_in_storage(path, this.profpicfile, this.uid, 'client');
        x = {id : fileprop['id'],photoURL: fileprop['photoURL'] };
      }
      console.log(this.viewClientForm.value)
      console.log(this.clientid)
      this.clientservice.updateClient(this.clientid,this.viewClientForm.value,x)
      this.router.navigate(['/profile']);
    }
  }
  public onPasswordReset(): void {
    this.userService.sendUserPasswordResetEmail();
    this.alertService.showToaster('Reset password is sent to your email');
  }



  public onUpdateUserInfo(form: NgForm): void {
    const displayName = form.value.displayName;
    const bio = form.value.bio;
    this.userService.updateUserInfo(firebase.auth().currentUser.uid, displayName, bio);
    this.alertService.showToaster('Your settings are saved');
  }

  public onLogout(): void {
    this.authService.logout();
    this.alertService.showToaster('Logout succesful');
  }

}
