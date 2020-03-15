import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  
  
  constructor(public db: AngularFirestore) { }
  public getProjects(isArchived: Boolean) {
    console.log('getproj');
    return this.db.collection('project' , 
      ref => ref.where('isArchived', '==', isArchived) ).valueChanges({ idField: 'id' });
  }

}
