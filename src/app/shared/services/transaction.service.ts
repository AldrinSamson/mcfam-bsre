import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FilesService } from './files.service';
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

  cancelTransaction(tid: string) {
    return this.db.collection('transaction').doc(tid).update({
      isCancelled: true,
      dateCancelled: new Date(),
      status: 'Client Cancelled'
    });
  }

  uploadDocuments(tid: string, uploadedfile: any) {
    return this.db.collection('transaction').doc(tid).update({
      doc_BIS: {desc: uploadedfile[0]['desc'], file:   uploadedfile[0]['filedetail']  },
      doc_POB: {desc: uploadedfile[6]['desc'], file:   uploadedfile[6]['filedetail']  },
      doc_POI: {desc: uploadedfile[5]['desc'], file:   uploadedfile[5]['filedetail']  },
      doc_PSS: {desc: uploadedfile[7]['desc'], file:   uploadedfile[7]['filedetail']  },
      doc_RA:  {desc: uploadedfile[2]['desc'], file:   uploadedfile[2]['filedetail']  },
      doc_RF:  {desc: uploadedfile[1]['desc'], file:   uploadedfile[1]['filedetail']  },
      doc_VG1: {desc: uploadedfile[3]['desc'], file:   uploadedfile[3]['filedetail']  },
      doc_VG2: {desc: uploadedfile[4]['desc'], file:   uploadedfile[4]['filedetail']  },
      stage: 3,
      status: 'Awaiting Manager Approval',
      dateUploaded: new Date()
    });
  }

  editDocuments(tid: string) {
    return this.db.collection('transaction').doc(tid).update({

    });
  }

  getDocumentsOfTransaction() {

  }
}
