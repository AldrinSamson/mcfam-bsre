import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material';
import { ProjectService } from '@shared/services/project.service';
import { FilesService } from '@shared/services/files.service';
import { MatGridListModule } from '@angular/material/grid-list';
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {
  public projectSub: Subscription;
  projects: any[]; //MatTableDataSource<any>;
  displayedColumnsProject: string[] = ['name', 'saleType', 'propertyType', 'addressStreet', 'addressTown', 'addressCity', 'addressRegion', 'cost', 'status'];
  constructor(public projectService: ProjectService, public dialog: MatDialog, public fs: FilesService) { }

  ngOnInit() {
    this.getProject();
  }
  getProject() {
    var thisclass = this;
    this.projectSub = this.projectService.getProjects(false)
      .subscribe(async result => {
        //result;//new MatTableDataSource(result);
        //console.log(result)
        for (var i = 0; i < result.length; i++) {
          var x = result[i];

          var y = thisclass.fs.getFile(x['photoURL'][0]);
          console.log(x['photoURL'][0]);
          await y.then(function (res2) {
            var x = res2 === '' ? '' : res2['photoURL'];
            //console.log(x);
            result[i]['photoURL'] = x;
          })
          //console.log(result)
        }
        this.projects = result;
        //console.log(result)
        //console.log(this.projects)
      });
  }
  getFile() {

  }
  ngOnDestroy() {
    if (this.projectSub != null) {
      this.projectSub.unsubscribe();
    }
  }
}
