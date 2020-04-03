import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertService } from './alert.service';


@Injectable({
  providedIn: 'root'
})
export class AgentService {

  constructor(public afAuth: AngularFireAuth,
    public db: AngularFirestore,
    public alertService: AlertService) { }

  getWithPosition(position) {
    return this.db.collection('broker', ref => ref.where('position', '==', position)).valueChanges({ idField: 'id' });
  }

  getOne(id) {
    return this.db.collection('broker').doc(id).snapshotChanges();
  }
}
