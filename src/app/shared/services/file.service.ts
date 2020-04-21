import { Injectable } from '@angular/core';
import { FileModel } from '../models/file.model';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { AngularFireStorage } from 'angularfire2/storage';
@Injectable({
  providedIn: 'root'
})
export class FileService {
  private fileCollection: AngularFirestoreCollection<FileModel>;
  files: any;
  //joined$: Observable<any>;
  constructor(public afAuth: AngularFireAuth, public router: Router, public firestore: AngularFirestore,
    public afs: AngularFirestore, public afstorage: AngularFireStorage) {
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
  async upload_in_storage(path, file, uid, category) {

    var file1 = {
      name: file.name,
      lastModified: file.lastModified,
      lastModifiedDate: file.lastModifiedDate,
      webkitRelativePath: file.webkitRelativePath,
      size: file.size,
      type: file.type
    };
    var thisclass = this;

    return new Promise(function (resolve, reject) {
      console.log(file);

      var storageRef = firebase.storage().ref(path);

      var task = storageRef.put(file);
      task.then(function (snapshot) {
        snapshot.ref.getDownloadURL().then(async function (url) {
          const id = await thisclass.firestore.createId();
          var fileprop = {
            id: id,
            fileProperties: file1,
            uidUploaded: uid,
            section: 'BMS',
            fileName: `storeFile${new Date().getTime()}_${file.name}`,
            category: category,
            photoURL: url,
            path: path
          };
          await thisclass.createFile(fileprop);
          resolve(fileprop);
        })
      })

    })
  }

  async upload_in_storage_percent(path, file, uid, category, theclass) {
    console.log(file);
    console.log(theclass);
    var file1 = { 
      name: file.name,
      lastModified: file.lastModified,
      lastModifiedDate: file.lastModifiedDate,
      webkitRelativePath: file.webkitRelativePath,
      size: file.size,
      type: file.type
    };
    var thisclass = this;

    return new Promise(function (resolve, reject) {
      console.log(file);

      var storageRef = firebase.storage().ref(path);
      
      var task = thisclass.afstorage.upload(path,file);
      theclass.upload_perc = task.percentageChanges()
      var d =  task.percentageChanges()
      console.log(d)
      task.then(function (snapshot) {
        snapshot.ref.getDownloadURL().then(async function (url) {
          const id = await thisclass.firestore.createId();
          var fileprop = {
            id: id,
            fileProperties: file1,
            uidUploaded: uid,
            section: 'BMS',
            fileName: `storeFile${new Date().getTime()}_${file.name}`,
            category: category,
            photoURL: url,
            path: path
          };
          await thisclass.createFile(fileprop);
          resolve(fileprop);
        })
      })

    })
  }

  async createFile(fl: any) {
    //return this.accountCollection.add(acc);
    var thisclass = this;
    return new Promise(function (resolve, reject) {
    
      const f: FileModel = {
        id: fl.id,
        //id: id,
        fileProperties: fl.fileProperties,
        uidUploaded: fl.uidUploaded,
        section: 'BSRE',
        fileName: fl.fileName,
        category: fl.category,
        photoURL: fl.photoURL,
        path: fl.path
      };
      
      thisclass.fileCollection.doc(fl.id).set(f);
      resolve(f);
    })
  }
}
