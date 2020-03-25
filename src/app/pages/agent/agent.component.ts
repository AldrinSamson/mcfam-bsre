import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material';
import { AgentService } from '@shared/services/agent.service';
import { FilesService } from '@shared/services/files.service';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent implements OnInit, OnDestroy {

  agents: any[];
  agentSub: Subscription;
  agentSearchText
  p

  constructor(public agentService: AgentService,
     public dialog: MatDialog, 
     public fs: FilesService,
     public router: Router) { }

  ngOnInit() {
    this.getAgents();
  }

  getAgents(){
    this.agentSub = this.agentService.getWithPosition('Agent').subscribe( results =>  {
      this.agents = results
    })
  }

  ngOnDestroy(): void {
    if(!this.agentSub){
      this.agentSub.unsubscribe();
    }

  }
}
