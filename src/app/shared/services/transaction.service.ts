import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FilesService } from './files.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(public db: AngularFirestore , public alertService: AlertService) {

  }

  getTransaction(uid: String) {
    //console.log(uid)
    return this.db.collection('transaction', ref =>
      ref.where('clientUid', '==', uid))
      .valueChanges({ idField: 'id' });

  }
  getOneTransaction(id) {
    var thisclass = this;
    console.log(id)
    return new Promise(function (resolve) {
      thisclass.db.collection('transaction').doc(id).ref.get()
        .then(doc => {
          var project = {
            id: doc.id,
            ...doc.data()
          }
          resolve(project)
        });
    })
  }

  cancelTransaction(tid: string) {
    return this.db.collection('transaction').doc(tid).update({
      isCancelled: true,
      dateCancelled: new Date(),
      status: 'Client Cancelled'
    });
  }

  rateTransaction(tid: string, rating: number, feedback: string , isLeased: Boolean) {

    let data;
    if (isLeased) {
      data = {
        rating: rating,
        feedback: feedback,
        dateRated : new Date(),
        status: 'Leased, Feedback Received'
      };
    } else {
      data = {
        rating: rating,
        feedback: feedback,
        dateRated : new Date(),
        status: 'Completed, Feedback Received'
      };
    }

    this.alertService.showToaster('Thank you for your feedback');
    return this.db.collection('transaction').doc(tid).update(data);
  }

  uploadDocuments(tid: string, uploadedfile: any) {
    return this.db.collection('transaction').doc(tid).update({
      doc_BIS: { desc: uploadedfile[0]['desc'], file: uploadedfile[0]['filedetail'] },
      doc_POB: { desc: uploadedfile[6]['desc'], file: uploadedfile[6]['filedetail'] },
      doc_POI: { desc: uploadedfile[5]['desc'], file: uploadedfile[5]['filedetail'] },
      doc_PSS: { desc: uploadedfile[7]['desc'], file: uploadedfile[7]['filedetail'] },
      doc_RA: { desc: uploadedfile[2]['desc'], file: uploadedfile[2]['filedetail'] },
      doc_RF: { desc: uploadedfile[1]['desc'], file: uploadedfile[1]['filedetail'] },
      doc_VG1: { desc: uploadedfile[3]['desc'], file: uploadedfile[3]['filedetail'] },
      doc_VG2: { desc: uploadedfile[4]['desc'], file: uploadedfile[4]['filedetail'] },
      doc_others: uploadedfile['toothers'],
      stage: 3,
      status: 'Awaiting Manager Approval',
      dateUploaded: new Date(),
      doc_status:'Files : Uploaded'
    });
  }

  editDocuments(tid: string, uploadedfile: any, otherfile) {
    if (uploadedfile[0]['filedetail']) {
      this.db.collection('transaction').doc(tid).update({
        doc_BIS: { desc: uploadedfile[0]['desc'], file: uploadedfile[0]['filedetail'] },
      });
    }
    if (uploadedfile[6]['filedetail']) {
      this.db.collection('transaction').doc(tid).update({
        doc_POB: { desc: uploadedfile[6]['desc'], file: uploadedfile[6]['filedetail'] },
      });
    }
    if (uploadedfile[5]['filedetail']) {
      this.db.collection('transaction').doc(tid).update({
        doc_POI: { desc: uploadedfile[5]['desc'], file: uploadedfile[5]['filedetail'] },
      });
    }
    if (uploadedfile[7]['filedetail']) {
      this.db.collection('transaction').doc(tid).update({
        doc_PSS: { desc: uploadedfile[7]['desc'], file: uploadedfile[7]['filedetail'] },
      });
    }
    if (uploadedfile[2]['filedetail']) {
      this.db.collection('transaction').doc(tid).update({
        doc_RA: { desc: uploadedfile[2]['desc'], file: uploadedfile[2]['filedetail'] },
      });
    }
    if (uploadedfile[1]['filedetail']) {
      this.db.collection('transaction').doc(tid).update({
        doc_RF: { desc: uploadedfile[1]['desc'], file: uploadedfile[1]['filedetail'] },
      });
    }
    if (uploadedfile[3]['filedetail']) {
      this.db.collection('transaction').doc(tid).update({
        doc_VG1: { desc: uploadedfile[3]['desc'], file: uploadedfile[3]['filedetail'] },
      });
    }
    if (uploadedfile[4]['filedetail']) {
      this.db.collection('transaction').doc(tid).update({
        doc_VG2: { desc: uploadedfile[4]['desc'], file: uploadedfile[4]['filedetail'] },
      });
    }

    
    if (otherfile) {
      this.db.collection('transaction').doc(tid).update({
        doc_others: otherfile
      });
    }

  }

  getDocumentsOfTransaction() {

  }
}
