import { Component, OnInit, Inject, OnDestroy, ElementRef } from '@angular/core';
import { FirebaseService, FileService, ProjectService, AuthService, MailerService} from '../../shared';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, UrlTree, PRIMARY_OUTLET } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { Subscription, Observable } from 'rxjs';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.scss']
})
export class ViewProjectComponent implements OnInit , OnDestroy {

  tree: UrlTree;
  projectID;

  projectSub: Subscription;
  project;
  viewphotos = [];
  cover_photo_file: any;
  cover_photo: any;
  cov_photo_change=false;
  viewFiles = [];
  arrayphoto = [];
  editProjectForm: any;

  agentSub: Subscription;
  agent;

  propertySingleCarousel: OwlOptions = {
    loop: true,
    margin: 0,
    nav: true,
    navText: ['<i class="ion-ios-arrow-back" aria-hidden="true"></i>', '<i class="ion-ios-arrow-forward" aria-hidden="true"></i>'],
    responsive: {
      0: {
        items: 1,
      }
    }
  }

  constructor(
    private router: Router,
    public firebaseService: FirebaseService,
    public projectService: ProjectService,
    public fb: FormBuilder,
    public fileservice: FileService,
    public dialog: MatDialog,
    public authService: AuthService,
    public mailerService: MailerService) { }

  ngOnInit() {
    this.getProjectAndAgent();
  }

  testMailer() {
    this.mailerService.sendEmail('aldrinbautistasamson@gmail.com' , 'dwdw' , 'eqweq');
  }

  getProjectAndAgent() {
    this.tree = this.router.parseUrl(this.router.url);
    this.projectID = this.tree.root.children[PRIMARY_OUTLET].segments[1].path;
    this.projectSub = this.firebaseService.getOne(this.projectID , 'project').subscribe(async result => {
      this.project = result.payload.data();
      this.project.id = result.payload.id;
      console.log(this.project);
      var photoid = [];
      for (var i = 0; i < this.project['photoURL'].length; i++) {
        console.log( this.project['photoURL'][i])
        if (this.project['photoURL'][i]['photoURL']) {
          console.log(this.project['photoURL'][i]['photoURL'])
          this.viewphotos.push(this.project['photoURL'][i])
          photoid.push(this.project['photoURL'][i]['id']);
        } else {
          try {
            var x = await this.fileservice.getFile(this.project['photoURL'][i]);
            console.log(x);
            this.viewphotos.push({ id: x['id'], photoURL: x['photoURL'] })
            photoid.push(x['id']);
          } catch (err) {
          }
        }
      }
      console.log(this.viewphotos);
      if (this.project['cover_photo']) {
        this.cover_photo_file = this.project['cover_photo']
        this.cover_photo = this.project['cover_photo']['photoURL']
      }
      this.agentSub = this.firebaseService.getOne(this.project.agentUid , 'broker').subscribe( res => {
        this.agent = res.payload.data();
        this.agent.id = res.payload.id;
      })
    });

    return true
  }

  ngOnDestroy() {
    if (this.projectSub != null) {
      this.projectSub.unsubscribe();
    }
  }

}
