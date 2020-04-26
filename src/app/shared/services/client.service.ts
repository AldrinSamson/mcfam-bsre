import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private db: AngularFirestore,
    public http: HttpClient,
    public alertService: AlertService,
    public afAuth: AngularFireAuth ) { }

  createClient(values) {
    return this.afAuth.auth.createUserWithEmailAndPassword(values.email, values.password)
                 .then((authData) => {
                  this.db.collection('client').add({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    fullName: values.fullName,
                    userName: values.userName,
                    email: values.email,
                    contactNumber : values.contactNumber,
                    addressCity: values.addressCity,
                    addressRegion: values.addressRegion,
                    photoURL: values.photoURL,
                    uid : authData.user.uid,
                  });
                  this.alertService.showToaster('Sign Up Success , Log in now');
                })
                .catch((_error) => {
                    this.alertService.showToaster(_error.message);
                });
  }

  updateClient(id, values, file) {
    if (file) {
      this.db.collection('client').doc(id).update({
        photoURL : file
      });
    }
    this.db.collection('client').doc(id).update({
      firstName: values.firstName,
      lastName: values.lastName,
      fullName: values.fullName,
      userName: values.userName,
      contactNumber: values.contactNumber,
      // addressStreet: values.addressStreet,
      // addressTown: values.addressTown,
      addressCity: values.addressCity,
      addressRegion: values.addressRegion,
    });
  }

  deleteClientAuth(uid) {
    const url = 'https://us-central1-mcfam-systems.cloudfunctions.net/terminateUser';
    const body: any = {
      'uid' : uid,
    };
    const output = <JSON>body;
    const httpOptions = {
      responseType: 'text' as 'json'
    };
    return this.http.post<any>(url , <JSON>output , httpOptions ).subscribe({
      error: error => console.error('There was an error!', error)
    }).unsubscribe();
  }
}
