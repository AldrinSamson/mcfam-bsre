import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertService } from './alert.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AgentService {

  constructor(public afAuth: AngularFireAuth,
    public db: AngularFirestore,
    public alertService: AlertService,
    public http: HttpClient) { }

  getWithPosition(position) {
    return this.db.collection('broker', ref => ref.where('position', '==', position)).valueChanges({ idField: 'id' });
  }

  getOne(id) {
    return this.db.collection('broker').doc(id).snapshotChanges();
  }

  getOneUid(uid) {
    return this.db.collection('broker', ref => ref.where('uid', '==', uid)).valueChanges({ idField: 'id' });
  }

  computeRating(uid) {
    const url = 'https://us-central1-mcfam-systems.cloudfunctions.net/computeRating?uid=' + uid;
    return this.http.options(url).subscribe({
      error: error => console.error('There was an error!', error)
    }).unsubscribe();
  }
}
