import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FileModel } from '@shared/models/file.model';
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
  getFile(id) {
    return new Promise(resolve => {
      this.firestore.collection<FileModel>('filesStored',
        ref =>
          ref.where('id', '==', id)
      ).snapshotChanges().subscribe(data => {
        //console.log()
        if (data.length == 0) {
          console.log(data.length)
          resolve('')
          
          return
        } else {
          return data.map(e => {
            console.log(id)
            if (id === e.payload.doc.id) {
              var x =
                {
                  id: e.payload.doc.id,
                  ...e.payload.doc.data()
                } as any;
              resolve(x);
              return x;
            }
          })
        }

      });
    })

  }

}
