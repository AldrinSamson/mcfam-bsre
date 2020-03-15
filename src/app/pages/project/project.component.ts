import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material';
import { ProjectService } from '@shared/services/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements  OnInit, OnDestroy {
  public projectSub: Subscription;
  projects: MatTableDataSource<any>;
  displayedColumnsProject: string[] = ['name', 'saleType', 'propertyType', 'addressStreet', 'addressTown', 'addressCity', 'addressRegion', 'cost', 'status'];
  constructor(public projectService: ProjectService,public dialog: MatDialog) { }

  ngOnInit() {
    this.getProject();
  }
  getProject() {
    this.projectSub = this.projectService.getProjects(false)
      .subscribe(result => {
        this.projects = new MatTableDataSource(result);
        console.log(result)
        console.log(this.projects)
      });
  }
  ngOnDestroy() {
    if (this.projectSub != null) {
      this.projectSub.unsubscribe();
    }
  }
}
