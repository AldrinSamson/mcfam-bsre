import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProjectService } from '@shared/services/project.service';
import { FilesService } from '@shared/services/files.service';
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {

  projectSearchText;
  p;
  public projectSub: Subscription;
  projects: any[];
  
  constructor(public projectService: ProjectService,
     public fs: FilesService,
     public router: Router) { 
    }
  

  ngOnInit() {
    this.getProject();
  }
  getProject() {
    this.projectSub = this.projectService.getProjects(false)
    .subscribe(result => {
      this.projects = result;
    });
  }
  getFile() {

  }

  openViewProject(value): void {
    this.router.navigate(['/project/'+value.id+'']);
  }

  ngOnDestroy() {
    if (this.projectSub != null) {
      this.projectSub.unsubscribe();
    }
  }
}
