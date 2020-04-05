import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private db: AngularFirestore) { }
  updateClient(id, values, file) {
    if (file) {
      this.db.collection('client').doc(id).update({
        photoURL : file
      })
    }
    this.db.collection('client').doc(id).update({
      firstName: values.firstName,
      lastName: values.lastName,
      fullName: values.fullName,
      userName: values.userName,
      contactNumber: values.contactNumber,
      //addressStreet: values.addressStreet,
      addressTown: values.addressTown,
      //addressCity: values.addressCity,
      addressRegion: values.addressRegion,
    })
  }
}
