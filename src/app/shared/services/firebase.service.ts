import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    public db: AngularFirestore
  ) { }

  getAllData(tableName) {
    return this.db.collection(tableName).valueChanges({ idField: 'id' });
  }

  getOne(id , tableName) {
    return this.db.collection(tableName).doc(id).snapshotChanges();
  }
}
