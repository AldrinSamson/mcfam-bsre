import { Injectable } from '@angular/core';
import { FileModel } from '../models/file.model';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FileService {
  private fileCollection: AngularFirestoreCollection<FileModel>;
  files: any;
  joined$: Observable<any>;
  constructor(public afAuth: AngularFireAuth, public router: Router, public firestore: AngularFirestore,
    public afs: AngularFirestore) {
    this.fileCollection = afs.collection<FileModel>('filesStored');
    this.files = this.fileCollection.snapshotChanges().subscribe(data => {
      this.files = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as any;
      })
    });
  }
  getFiles() {
    return this.files;
  }
  getFilesMultiple() {

  }
  getFile(id) {
    var thisclass = this;
    console.log(id)
    return new Promise(function (resolve) {
      thisclass.firestore.collection('filesStored').doc(id).ref.get()
        .then(doc => {
          var project = {
            id: doc.id,
            ...doc.data()
          }
          resolve(project)
        });
    })
  }
}
