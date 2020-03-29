import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(public db: AngularFirestore) { 
   
  }

  getTransaction(uid: String) {

      return this.db.collection('transaction', ref =>
      ref.where('clientUid', '==', uid))
      .valueChanges({ idField: 'id' });
    
  }

  cancelTransaction(tid : string){
    return this.db.collection('transaction').doc(tid).update({
      isCancelled: true,
      dateCancelled: new Date(),
      status: 'Client Cancelled'
    });
  }

  uploadDocuments(tid : string){
    return this.db.collection('transaction').doc(tid).update({
      stage: 3,
      status: 'Awaiting Manager Approval',
      dateUploaded: new Date()
    });
  }

  editDocuments(tid : string){
    return this.db.collection('transaction').doc(tid).update({
      
    });
  }

  getDocumentsOfTransaction(){

  }
}
