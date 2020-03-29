import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FirebaseService, AuthService, TransactionService } from '../../shared';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import * as $ from 'jquery';


@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  transactions: Array<any>;
  activeTransactions: Array<any>;
  managerDisapprovedTransactions: Array<any>;
  cancelledTransactions: Array<any>;
  completedTransactions: Array<any>;
  public transactionSub: Subscription;
  uid: String;
  private isManager: Boolean;

  constructor(public fbs: FirebaseService,
    public transactionService: TransactionService,
    public dialog: MatDialog,
    public authService: AuthService) {
  }

  ngOnInit() {
    this.uid = sessionStorage.getItem('session-user-uid')
    this.getUserTransactions();
  }

  getUserTransactions() {
    this.transactionSub = this.transactionService.getTransaction(this.uid).subscribe(res => {
      this.transactions = res;
      this.activeTransactions = this.transactions.filter(res => res.isCompleted === false && res.isApproved === false && res.isDisapproved === false && res.isCancelled === false);
      this.managerDisapprovedTransactions = this.transactions.filter(res => res.isCompleted === false && res.isApproved === false && res.isDisapproved === true);
      this.cancelledTransactions = this.transactions.filter(res => res.isCompleted === false && res.isCancelled === true);
      this.completedTransactions = this.transactions.filter(res => res.isCompleted === true && res.isApproved === true && res.isDisapproved === false && res.isCancelled === false);
    });
  }


  openViewTransaction(value, status): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      transactionID: value.id,
      projectName: value.projectName,
      projectCost: value.projectCost,
      projectSaleType: value.projectSaleType,
      agentName: value.agentName,
      clientName: value.clientName,
      managerName: value.managerName,
      dateStart: value.dateStart,
      status: value.status,
      stage: value.stage,
      isCompleted: value.isCompleted,
      isManagerApproved: value.isManagerApproved,
      isCustomerApproved: value.isCustomerApproved,
      isDeleted: value.isDeleted,
      buttonConfig: status
    };
    this.dialog.open(ViewSaleTransactionComponent, dialogConfig).afterClosed().subscribe(result => {
      this.getUserTransactions();
    });

  }

  ngOnDestroy() {
    if (this.transactionSub != null) {
      this.transactionSub.unsubscribe();
    }
  }

}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'view-sale-transaction-dialog',
  templateUrl: './dialog/view-transaction-dialog.html',
  styleUrls: ['./transaction.component.scss'],
})

export class ViewSaleTransactionComponent {

  public stage: number;
  public buttonConfig: string;

  constructor(
    public trasactionService: TransactionService,
    public dialogRef: MatDialogRef<ViewSaleTransactionComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.stage = this.data.stage;
    this.buttonConfig = this.data.buttonConfig;
  }

  cancelTransaction() {
    this.trasactionService.cancelTransaction(this.data.transactionID)
    this.dialogRef.close();
  }

  uploadDocuments() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      transactionID: this.data.transactionID,
      stage: this.stage,
      buttonConfig: this.buttonConfig
    };
    this.dialog.open(UploadDocumentComponent, dialogConfig).afterClosed().subscribe(result => {
      this.dialogRef.close();
    });
  }

  editDocuments() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      transactionID: this.data.transactionID,
      stage: this.stage,
      buttonConfig: this.buttonConfig
    };
    this.dialog.open(EditDocumenComponent, dialogConfig).afterClosed().subscribe(result => {
      this.dialogRef.close();
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-doc-dialog',
  templateUrl: './dialog/upload-doc-dialog.html',
  styleUrls: ['./transaction.component.scss'],
})

export class UploadDocumentComponent {
  toUpload = [{ desc: 'Buyer Information Sheet', file: undefined },
  { desc: 'Reservation Fee', file: undefined },
  { desc: 'Reservation Agreement', file: undefined },
  { desc: 'Valid Goverment ID 1', file: undefined },
  { desc: 'Valid Goverment ID 2', file: undefined },
  { desc: 'Proof of Income', file: undefined },
  { desc: 'Proof of Billing', file: undefined },
  { desc: 'Payment Schedule Scheme', file: undefined },
    // { desc: 'Others', file: undefined }
  ]
  constructor(
    public trasactionService: TransactionService,
    public dialogRef: MatDialogRef<UploadDocumentComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }
  selectFile(event){
    //this.toUpload[indexOfelement]['file']= file[indexOfelement]
    console.log(event);
    var getidno = (event.target.id).substring(3);
    var tonum = parseInt(getidno);
    this.toUpload[tonum]['file'] = event.target.files[0];

    if(this.toUpload[tonum]['file']){
      document.getElementById('upbtn_'+getidno).classList.remove('btn-primary');
      document.getElementById('upbtn_'+getidno).classList.add('btn-success');
    }else{
      document.getElementById('upbtn_'+getidno).classList.add('btn-primary');
      document.getElementById('upbtn_'+getidno).classList.remove('btn-success');
    }

    console.log(this.toUpload)


  }
  upclick(indexOfelement){
    $('#up_'+indexOfelement).click();
    
  }

  uploadDocuments() {
    this.trasactionService.uploadDocuments(this.data.transactionID);
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-doc-dialog',
  templateUrl: './dialog/edit-doc-dialog.html',
  styleUrls: ['./transaction.component.scss'],
})

export class EditDocumenComponent {

  constructor(
    public trasactionService: TransactionService,
    public dialogRef: MatDialogRef<EditDocumenComponent>,
    public fb: FormBuilder,
    public dialog: MatDialog,
    public authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  editDocuments() {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


