import { Injectable, Sanitizer } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DomSanitizer } from '@angular/platform-browser';
import {Http, ResponseContentType} from '@angular/http';
import { FilesService } from './files.service';
import { AlertService } from './alert.service';
import * as JSZipUtils from 'jszip-utils'
import * as JSZip from 'jszip';
import * as cors from 'cors';
import 'rxjs/Rx' ;
import { Observable } from 'rxjs/Rx';

const corsHandler = cors({ origin: true });

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  toUpload = [{ desc: 'Buyer Information Sheet', file: undefined },//0
  { desc: 'Reservation Fee', file: undefined },//1
  { desc: 'Reservation Agreement', file: undefined },//2
  { desc: 'Valid Goverment ID 1', file: undefined },//3
  { desc: 'Valid Goverment ID 2', file: undefined },//4
  { desc: 'Proof of Income', file: undefined },//5
  { desc: 'Proof of Billing', file: undefined },//6
  { desc: 'Payment Schedule Scheme', file: undefined },//7
    //{ desc: 'Others', file: undefined }
  ]
  constructor(public db: AngularFirestore, public alertService: AlertService,
    sanitizer: DomSanitizer,private http: Http, public fileservice: FilesService) {

  }

  getTransaction(uid: String) {
    return this.db.collection('transaction', ref =>
      ref.where('clientUid', '==', uid))
      .valueChanges({ idField: 'id' });

  }



  getOneTransaction(id) {
    //console.log(id);
    const thisclass = this;
    return new Promise(function (resolve) {
      thisclass.db.collection('transaction').doc(id).ref.get()
        .then(doc => {
          const project = {
            id: doc.id,
            ...doc.data()
          };
          resolve(project);
        });
    });
  }

  async downloadMulitple(transid) {

    var zip: JSZip =
      typeof (<any>JSZip).default === "function" ? new (<any>JSZip).default() : new JSZip();

    var count = 0;
    var zipFilename = "Transaction.zip";
    var proponetrans = await this.getOneTransaction(transid);
    console.log(proponetrans)
    var urls = [
      proponetrans['doc_BIS']['file']['fileurl'],
      proponetrans['doc_RF']['file']['fileurl'],
      proponetrans['doc_RA']['file']['fileurl'],
      proponetrans['doc_VG1']['file']['fileurl'],
      proponetrans['doc_VG2']['file']['fileurl'],
      proponetrans['doc_POI']['file']['fileurl'],
      proponetrans['doc_POB']['file']['fileurl'],
      proponetrans['doc_PSS']['file']['fileurl']
    ];
    var toUpload2 = [{ desc: 'Buyer Information Sheet' },//0
    { desc: 'Reservation Fee' },//1
    { desc: 'Reservation Agreement' },//2
    { desc: 'Valid Goverment ID 1' },//3
    { desc: 'Valid Goverment ID 2' },//4
    { desc: 'Proof of Income' },//5
    { desc: 'Proof of Billing' },//6
    { desc: 'Payment Schedule Scheme' }
    ]
    try {
      for (var i = 0; i < urls.length; i++) {
        var url = urls[i];
        console.log(url)
        var filename = toUpload2[i]['desc'];
        console.log(filename)
        zip.file(filename, await this.urlToPromise(url), { binary: true });
      }

      zip.generateAsync({ type: "blob" }).then(function (zipFile) {
        this.saveAs(zipFile, zipFilename);

      });
    } catch (err) {
      console.log(err, 'here')
    }
    /*
    $(".downloadAll").on('click', function () { // find every song urls 
      $(".album-dl-box").find("a").each(function () {
        var song = $(this); 
        var url = song.attr('href'); 
        var filename = url.replace(/.*\/|%20/g, "").replace(/%5d/g, "]").replace(/%5b/g, "["); 
        JSZipUtils.getBinaryContent(url, function (err, data) {
          if (err) {
            throw err; // or handle the error 
          } var zip = new JSZip(); zip.file(filename, data, { binary: true });
        });
      });
    })*/


  }
  urlToPromise(url) {
    try {
      return new Promise(function (resolve, reject) {
        JSZipUtils.getBinaryContent(url, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    } catch (err) {
      console.log(err)
    }
  }
  cancelTransaction(tid: string) {
    return this.db.collection('transaction').doc(tid).update({
      isCancelled: true,
      dateCancelled: new Date(),
      status: 'Client Cancelled'
    });
  }
  downloadFile(url): Observable<any>{
		return this.http.get(url, {responseType: ResponseContentType.Blob});
  }
  rateTransaction(tid: string, rating: number, feedback: string, isLeased: Boolean) {

    let data;
    if (isLeased) {
      data = {
        rating: rating,
        feedback: feedback,
        dateRated: new Date(),
        status: 'Leased, Feedback Received'
      };
    } else {
      data = {
        rating: rating,
        feedback: feedback,
        dateRated: new Date(),
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
      doc_status: 'Files : Uploaded'
    });
  }

  async editDocuments(tid: string, uploadedfile: any, otherfile) {
    var x = await this.getOneTransaction(tid);
    console.log(x);
    if (uploadedfile[0]['filedetail']) {
      this.fileservice.delete_in_storage( x['doc_BIS']['file']['id'])
      
      this.db.collection('transaction').doc(tid).update({

        doc_BIS: { desc: uploadedfile[0]['desc'], file: uploadedfile[0]['filedetail'] },
      });
    }
    if (uploadedfile[6]['filedetail']) {
      this.fileservice.delete_in_storage( x['doc_POB']['file']['id'])
      this.db.collection('transaction').doc(tid).update({
        doc_POB: { desc: uploadedfile[6]['desc'], file: uploadedfile[6]['filedetail'] },
      });
    }
    if (uploadedfile[5]['filedetail']) {
      this.fileservice.delete_in_storage( x['doc_POI']['file']['id'])
      this.db.collection('transaction').doc(tid).update({
        doc_POI: { desc: uploadedfile[5]['desc'], file: uploadedfile[5]['filedetail'] },
      });
    }
    if (uploadedfile[7]['filedetail']) {
      this.fileservice.delete_in_storage( x['doc_PSS']['file']['id'])
      this.db.collection('transaction').doc(tid).update({
        doc_PSS: { desc: uploadedfile[7]['desc'], file: uploadedfile[7]['filedetail'] },
      });
    }
    if (uploadedfile[2]['filedetail']) {
      this.fileservice.delete_in_storage( x['doc_RA']['file']['id'])
      this.db.collection('transaction').doc(tid).update({
        doc_RA: { desc: uploadedfile[2]['desc'], file: uploadedfile[2]['filedetail'] },
      });
    }
    if (uploadedfile[1]['filedetail']) {
      this.fileservice.delete_in_storage( x['doc_RF']['file']['id'])
      this.db.collection('transaction').doc(tid).update({
        doc_RF: { desc: uploadedfile[1]['desc'], file: uploadedfile[1]['filedetail'] },
      });
    }
    if (uploadedfile[3]['filedetail']) {
      this.fileservice.delete_in_storage( x['doc_VG1']['file']['id'])
      this.db.collection('transaction').doc(tid).update({
        doc_VG1: { desc: uploadedfile[3]['desc'], file: uploadedfile[3]['filedetail'] },
      });
    }
    if (uploadedfile[4]['filedetail']) {
      this.fileservice.delete_in_storage( x['doc_VG2']['file']['id'])
      this.db.collection('transaction').doc(tid).update({
        doc_VG2: { desc: uploadedfile[4]['desc'], file: uploadedfile[4]['filedetail'] },
      });
    }

    if (otherfile) {
      for(var i = 0; i< x['doc_others'].length;i++){
        var y = x['doc_others'][i]['id']
        this.fileservice.delete_in_storage(y);
      }
      this.db.collection('transaction').doc(tid).update({
        doc_others: otherfile
      });
    }

  }

  getDocumentsOfTransaction() {

  }
}
