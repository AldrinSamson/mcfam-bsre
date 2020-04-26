import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@shared';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService , ClientService ,UserService } from '../../shared';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {

  email = '';
  passw = '';
 
  constructor(private authService: AuthService,
    private router: Router,
    public fbs: FirebaseService,
    public dialog: MatDialog,
    public db: AngularFirestore) {}
  
  
  login(){
    this.authService.login(this.email,this.passw).then(() => {
    });
    
  }

  openPasswordReset() {
    this.dialog.open(PasswordResetDialogComponent);
  }

  openSignUp() {
    this.dialog.open(SignUpDialogComponent);
  }

}

@Component({
  // tslint:disable-next-line:component-selector
  selector : 'sign-up-dialog',
  templateUrl : './dialog/sign-up-dialog.html',
  styleUrls: ['./auth.component.scss'],
})

export class SignUpDialogComponent {

  addClientForm: any;

  constructor(
    public dialogRef: MatDialogRef<SignUpDialogComponent>,
    public fb: FormBuilder,
    public ClientService: ClientService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.addClientForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      userName: [''],
      contactNumber: [''],
      email : [''],
      addressCity: [''],
      addressRegion: [''],
      photoURL: [''],
      uid: [''],
      password: [''],
      'fullName': ['']
    });
  }

  submitAddClientForm() {
    if (this.addClientForm.valid) {
      this.addClientForm.controls['fullName'].setValue(this.addClientForm.value.firstName + ' ' + this.addClientForm.value.lastName);
      this.ClientService.createClient(this.addClientForm.value);
      this.dialogRef.close();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector : 'password-reset-dialog',
  templateUrl : './dialog/password-reset-dialog.html',
  styleUrls: ['./auth.component.scss'],
})

export class PasswordResetDialogComponent {

  email = '';

  constructor(
    public dialogRef: MatDialogRef<PasswordResetDialogComponent>,
    public fb: FormBuilder,
    public userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  sendResetEmail() {
    this.userService.sendUserPasswordResetEmailForgot(this.email);
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
