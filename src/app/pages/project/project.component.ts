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
    var thisclass = this;
    this.projectSub = this.projectService.getProjects(false)
      .subscribe(async result => {
        for (var i = 0; i < result.length; i++) {
          var x = result[i];
          var photoLink = [];
          var displaypic =''
          for(var j = 0; j < x['photoURL'].length; j++ ){
            var y = thisclass.fs.getFile(x['photoURL'][j]);
            await y.then(function (res2) {
              var x = res2 === '' ? '' : res2['photoURL'];
              if(j==0){
                displaypic = x;
              }
              photoLink.push(x); 
            });
          }
          result[i]['displaypic'] = displaypic;
          result[i]['photoURL'] = photoLink;
        }
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
