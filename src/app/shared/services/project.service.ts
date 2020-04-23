import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {


  constructor(public db: AngularFirestore) { }

  getProjects(isArchived: Boolean) {
    return this.db.collection('project' , ref => ref.where('isArchived', '==', isArchived)).valueChanges({ idField: 'id' });
  }

  getFeaturedProjects() {
    return this.db.collection('project' , ref => ref.where('isFeatured', '==', true)
    .where('isArchived', '==', false)).valueChanges({ idField: 'id' });
  }

}
