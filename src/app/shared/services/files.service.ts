import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FileModel } from '@shared/models/file.model';
import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class FilesService {
  fileCollection: any;
  files: any;
  constructor(public firestore: AngularFirestore) {
    this.fileCollection = firestore.collection<FileModel>('filesStored');
    this.files = this.fileCollection.snapshotChanges().subscribe(data => {
      //console.log(data)
      this.files = data.map(e => {
        //console.log(e)
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as any;
      })
    });
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

  filedelete(id) {
    //console.log(id);
    let deleteDoc = this.firestore.collection('filesStored').doc(id).delete();
    //console.log(deleteDoc)
  }
  async delete_in_storage(id) {
    // Create a reference to the file to delete
    //console.log(id)
    var x = await this.getFile(id);
    var path = x['path'];
    //this.filedelete(id);
    //console.log(x)
    if(path){
      var storageRef = firebase.storage().ref(path);
      var desertRef = storageRef.child(path);
  
      // Delete the file
      desertRef.delete().then(function () {
        // File deleted successfully
      }).catch(function (error) {
        // Uh-oh, an error occurred!
      });
    }
    /*
        */
  }

  

}
