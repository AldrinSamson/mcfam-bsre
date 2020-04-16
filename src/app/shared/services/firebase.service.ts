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

  addOne(value , tableName) {
    return this.db.collection(tableName).add(value)
    .then((res) => {
      //this.alertService.showToaster('Create Success');
    })
    .catch((_error) => {
      console.log('' + tableName + ' Create Failed!', _error);
    });
  }

  getOneUid(uid , table ) {
    return this.db.collection(table, ref => ref.where('uid', '==', uid)).valueChanges({ idField: 'id' });
  }
}
