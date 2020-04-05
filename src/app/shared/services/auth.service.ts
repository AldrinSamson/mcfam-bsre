import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { AlertService } from './alert.service';

@Injectable()
export class AuthService {
  public token: any;
  userDetails: Array<any>;
  userUid: any;
  userPosition: any;


  constructor(public afAuth: AngularFireAuth,
    private router: Router,
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private alert: AlertService) { }

  async login(email: string, password: string) {
    //console.log(" user auth "+this.isAuthenticated());
    try {

      var result = await this.afAuth.auth.signInWithEmailAndPassword(email, password).then(res => {
        this.userUid = res.user.uid
        this.db.collection('client', ref => ref.where('uid', '==', res.user.uid)).valueChanges().forEach(result => {
          this.userDetails = result
          sessionStorage.setItem('session-alive', 'true');
          sessionStorage.setItem('session-user-uid', this.userUid)
          sessionStorage.setItem('session-user-details', JSON.stringify(this.userDetails[0]));
          this.router.navigate(['/home']);
        })
      });
    } catch (err) {
      console.log(err);
      this.alert.showToaster("Email or Password is wrong");
    }
  }

  public logout(): void {
    sessionStorage.removeItem('session-alive');
    sessionStorage.removeItem('session-user-uid');
    sessionStorage.removeItem('session-user-details');
    this.token = null;
    this.router.navigate(['/home']);
  }

  public getIdToken(): string {
    firebase.auth().currentUser.getIdToken()
      .then(
        (token: string) => this.token = token
      );
    return this.token;
  }

  public isAuthenticated(): string {
    return sessionStorage.getItem('session-alive');
  }
}
