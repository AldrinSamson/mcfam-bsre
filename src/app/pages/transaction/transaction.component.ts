import { Component, OnInit, Inject } from '@angular/core';
import { FirebaseService, AuthService, TransactionService, FileService, AgentService } from '../../shared';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import * as $ from 'jquery';
import * as cors from 'cors';
const corsHandler = cors({ origin: true });
@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  transactions: Array<any>;
  activeTransactions: Array<any>;
  managerDisapprovedTransactions: Array<any>;
  leasedTransactions: Array<any>;
  cancelledTransactions: Array<any>;
  completedTransactions: Array<any>;
  public transactionSub: Subscription;
  uid: String;

  constructor(public fbs: FirebaseService,
    public transactionService: TransactionService,
    public dialog: MatDialog,
    public authService: AuthService,
    public fileservice: FileService
  ) {
  }

  ngOnInit() {
    this.uid = sessionStorage.getItem('session-user-uid')
    this.getUserTransactions();
  }

  getUserTransactions() {
    this.transactionSub = this.transactionService.getTransaction(this.uid).subscribe(res => {
      console.log(res)
      this.transactions = res;

      this.activeTransactions = this.transactions.filter(res => res.isCompleted === false
        && res.isDisapproved === false
        && res.isCancelled === false && res.isLeased === false);

      this.managerDisapprovedTransactions = this.transactions.filter(res => res.isCompleted === false && res.isDisapproved === true);

      this.cancelledTransactions = this.transactions.filter(res => res.isCancelled === true);

      this.leasedTransactions = this.transactions.filter(res => res.isApproved === true && res.isLeased === true);

      this.completedTransactions = this.transactions.filter(res => res.isCompleted === true && res.isApproved === true
        && res.isDisapproved === false && res.isCancelled === false && res.isLeased === false);

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
      agentUid: value.agentUid,
      clientName: value.clientName,
      clientUid: value.clientUid,
      managerName: value.managerName,
      managerUid: value.managerUid,
      dateStart: value.dateStart,
      status: value.status,
      stage: value.stage,
      isCompleted: value.isCompleted,
      isManagerApproved: value.isManagerApproved,
      isCustomerApproved: value.isCustomerApproved,
      isDeleted: value.isDeleted,
      buttonConfig: status,
      doc_status: value.doc_status,
      commissionRate: value.commissionRate,
      commissionTotal: value.commissionTotal,
      saleTotal: value.saleTotal,
      yearsToLease: value.yearsToLease,
      leaseTotal: value.leaseTotal,
      leaseMonth: value.leaseMonth,
      leaseYearStart: value.leaseYearStart,
      leaseYearEnd: value.leaseYearEnd,
    };
    this.dialog.open(ViewSaleTransactionComponent, dialogConfig).afterClosed().subscribe(result => {
      this.getUserTransactions();
    });

  }

  // tslint:disable-next-line: use-lifecycle-interface
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
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fileservice: FileService
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

  async editDocuments() {
    const dialogConfig = new MatDialogConfig();
    const trans = await this.trasactionService.getOneTransaction(this.data.transactionID);
    dialogConfig.data = {
      transactionID: this.data.transactionID,
      stage: this.stage,
      buttonConfig: this.buttonConfig,
      trans: trans
    };
    this.dialog.open(EditDocumenComponent, dialogConfig).afterClosed().subscribe(result => {
      this.dialogRef.close();
    });
  }

  rateAndFeedback() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      transactionID: this.data.transactionID,
      stage: this.stage,
      buttonConfig: this.buttonConfig,
      agentName: this.data.agentName,
      agentUid: this.data.agentUid,
    };
    console.log(dialogConfig);
    this.dialog.open(RateFeedbackComponent, dialogConfig).afterClosed().subscribe(result => {
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
  upload_perc: Observable<number>;
  toUpload = [{ desc: 'Buyer Information Sheet', file: undefined },//0
  { desc: 'Reservation Fee', file: undefined },//1
  { desc: 'Reservation Agreement', file: undefined },//2
  { desc: 'Valid Goverment ID 1', file: undefined },//3
  { desc: 'Valid Goverment ID 2', file: undefined },//4
  { desc: 'Proof of Income', file: undefined },//5
  { desc: 'Proof of Billing', file: undefined },//6
  { desc: 'Payment Schedule Scheme', file: undefined },//7
    // { desc: 'Others', file: undefined }
  ]
  othefiles: any;
  uid: any;
  currload = '';

  constructor(
    public trasactionService: TransactionService,
    public dialogRef: MatDialogRef<UploadDocumentComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fileservice: FileService
  ) {

  }

  ngOnInit() {
    this.uid = sessionStorage.getItem('session-user-uid')
  }



  selectFileOthers(event) {
    this.othefiles = event.target.files;
    console.log(this.othefiles)
    if (this.othefiles) {
      document.getElementById('otherfilebtn').classList.remove('btn-primary');
      document.getElementById('otherfilebtn').classList.add('btn-success');
      $('#otherdesc').text('file/s uploaded');
    } else {
      document.getElementById('otherfilebtn').classList.add('btn-primary');
      document.getElementById('otherfilebtn').classList.remove('btn-success');
      $('#otherdesc').text('');
    }

  }
  selectFile(event) {
    //this.toUpload[indexOfelement]['file']= file[indexOfelement]
    console.log(event);
    var getidno = (event.target.id).substring(3);
    var tonum = parseInt(getidno);
    this.toUpload[tonum]['file'] = event.target.files[0];

    if (this.toUpload[tonum]['file']) {
      document.getElementById('upbtn_' + getidno).classList.remove('btn-primary');
      document.getElementById('upbtn_' + getidno).classList.add('btn-success');
      $('#file_indic_' + getidno).text('a file uploaded');
    } else {
      document.getElementById('upbtn_' + getidno).classList.add('btn-primary');
      document.getElementById('upbtn_' + getidno).classList.remove('btn-success');
      $('#file_indic_' + getidno).text('');
    }

    console.log(this.toUpload)


  }
  upclick(indexOfelement) {
    $('#up_' + indexOfelement).click();

  }
  otherclick() {
    $('#otherfile').click();
  }

  async uploadDocuments() {
    var allupload = false;

    var totalitems = this.toUpload.length;
    //$('#totalload').html(totalitems);
    for (var i = 0; i < this.toUpload.length; i++) {
      var file1 = this.toUpload[i]['file'];
      if (!file1) {
        allupload = true;
      }
    }

    if (!allupload) {
      for (var i = 0; i < this.toUpload.length; i++) {
        this.currload = (i + 1) + "/" + this.toUpload.length
        var fl = this.toUpload[i]['file'];
        const path = `transactions/storeFile${new Date().getTime()}_${fl.name}`;
        console.log(allupload)
        var fileprop = await this.fileservice.upload_in_storage_percent(path, fl, this.uid, 'transaction', this)
        var x = { id: fileprop['id'], fileurl: fileprop['photoURL'] }
        this.toUpload[i]['filedetail'] = x
      }
      console.log(this.toUpload)

      if (this.othefiles) {
        var otherfl = []
        for (var i = 0; i < this.othefiles.length; i++) {
          this.currload = 'Others ' + (i + 1) + "/" + this.toUpload.length
          var fl = this.othefiles[i];
          const path = `transactions/storeFile${new Date().getTime()}_${fl.name}`;
          console.log(this.uid)
          var fileprop = await this.fileservice.upload_in_storage_percent(path, fl, this.uid, 'transaction', this)
          var x = { id: fileprop['id'], fileurl: fileprop['photoURL'] }
          otherfl.push(x)
        }
        this.toUpload['toothers'] = otherfl
      } else {
        this.toUpload['toothers'] = '';
      }
    }

    this.trasactionService.uploadDocuments(this.data.transactionID, this.toUpload);
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
  toUpload = [{ desc: 'Buyer Information Sheet', file: undefined },//0
  { desc: 'Reservation Fee', file: undefined },//1
  { desc: 'Reservation Agreement', file: undefined },//2
  { desc: 'Valid Goverment ID 1', file: undefined },//3
  { desc: 'Valid Goverment ID 2', file: undefined },//4
  { desc: 'Proof of Income', file: undefined },//5
  { desc: 'Proof of Billing', file: undefined },//6
  { desc: 'Payment Schedule Scheme', file: undefined },//7
    //{ desc: 'Others', file: undefined }
  ]
  trans: any;
  othefiles: any;
  uid: any;
  currload = '';

  //  : any;
  constructor(
    public trasactionService: TransactionService,
    public dialogRef: MatDialogRef<EditDocumenComponent>,
    public fb: FormBuilder,
    public dialog: MatDialog,
    public authService: AuthService,
    public fileservice: FileService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(this.data)
    this.toUpload[0]['filedetail'] = data['trans']['doc_BIS']
    this.toUpload[6]['filedetail'] = data['trans']['doc_POB']
    this.toUpload[5]['filedetail'] = data['trans']['doc_POI']
    this.toUpload[7]['filedetail'] = data['trans']['doc_PSS']
    this.toUpload[2]['filedetail'] = data['trans']['doc_RA']
    this.toUpload[1]['filedetail'] = data['trans']['doc_RF']
    this.toUpload[3]['filedetail'] = data['trans']['doc_VG1']
    this.toUpload[4]['filedetail'] = data['trans']['doc_VG2']
    //this.toUpload[8]['filedetail'] = data['trans']['doc_others']
    

  }
  ngOnInit() {
    this.uid = sessionStorage.getItem('session-user-uid')
  }
  downloadMulitple() {
    this.trasactionService.downloadMulitple(this.data.transactionID);
  }
  download(url, filename) {
    filename = this.data.transactionID + '_' + filename
    fetch(url, { mode: 'no-cors' }).then(function (t) {
      return t.blob().then((b) => {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.setAttribute("download", filename);
        a.click();
      }
      );
    });
  }

  selectFileOthers(event) {
    this.othefiles = event.target.files;
    console.log(this.othefiles)
    if (this.othefiles) {
      document.getElementById('otherfilebtn').classList.remove('btn-primary');
      document.getElementById('otherfilebtn').classList.add('btn-success');
      $('#otherdesc').text('file/s uploaded');
    } else {
      document.getElementById('otherfilebtn').classList.add('btn-primary');
      document.getElementById('otherfilebtn').classList.remove('btn-success');
      $('#otherdesc').text('');
    }

  }
  selectFile(event) {
    //this.toUpload[indexOfelement]['file']= file[indexOfelement]
    console.log(event);
    var getidno = (event.target.id).substring(3);
    var tonum = parseInt(getidno);
    this.toUpload[tonum]['file'] = event.target.files[0];

    if (this.toUpload[tonum]['file']) {
      document.getElementById('upbtn_' + getidno).classList.remove('btn-primary');
      document.getElementById('upbtn_' + getidno).classList.add('btn-success');
      $('#file_indic_' + getidno).text('a file uploaded');
    } else {
      document.getElementById('upbtn_' + getidno).classList.add('btn-primary');
      document.getElementById('upbtn_' + getidno).classList.remove('btn-success');
      $('#file_indic_' + getidno).text('');
    }

    console.log(this.toUpload)


  }
  upclick(indexOfelement) {
    $('#up_' + indexOfelement).click();
  }
  otherclick() {
    $('#otherfile').click();
  }

  async editDocuments() {
    var allupload = false;
    var toUpload2 = [{ desc: 'Buyer Information Sheet' },//0
    { desc: 'Reservation Fee' },//1
    { desc: 'Reservation Agreement' },//2
    { desc: 'Valid Goverment ID 1' },//3
    { desc: 'Valid Goverment ID 2' },//4
    { desc: 'Proof of Income' },//5
    { desc: 'Proof of Billing' },//6
    { desc: 'Payment Schedule Scheme' },//7
      //{ desc: 'Others' }
    ]
    if (!allupload) {
      for (var i = 0; i < this.toUpload.length; i++) {
        var fl = this.toUpload[i]['file'];
        if (fl) {
          //$('#currload').html(toUpload2[i]['desc']);
          //console.log(toUpload2[i]['desc'])
          this.currload = toUpload2[i]['desc']
          //document.getElementById('currload').innerHTML = (toUpload2[i]['desc']);
          const path = `transactions/storeFile${new Date().getTime()}_${fl.name}`;
          console.log(allupload)
          var fileprop = await this.fileservice.upload_in_storage_percent(path, fl, this.uid, 'transaction', this)
          var x = { id: fileprop['id'], fileurl: fileprop['photoURL'] }
          // this.toUpload[i]['filedetail']['desc'] = this.toUpload[i]['desc']
          toUpload2[i]['filedetail'] = x
        } else {

        }
      }
      var otherfl = undefined
      console.log(this.toUpload)
      if (this.othefiles) {
        otherfl = []
        console.log(this.othefiles)
        for (var i = 0; i < this.othefiles.length; i++) {
          var fl = this.othefiles[i];
          this.currload = (((i + 1) + "/" + this.othefiles.length))
          const path = `transactions/storeFile${new Date().getTime()}_${fl.name}`;
          console.log(fl)
          var fileprop = await this.fileservice.upload_in_storage(path, fl, this.uid, 'transaction')
          var x = { id: fileprop['id'], fileurl: fileprop['photoURL'] }
          otherfl.push(x)
        }
        //this.toUpload[8]['filedetail'] = otherfl

      }
      console.log(toUpload2)

    }

    this.trasactionService.editDocuments(this.data.transactionID, toUpload2, otherfl);
    this.dialogRef.close();
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'rate-feedback-dialog',
  templateUrl: './dialog/rate-feedback-dialog.html',
  styleUrls: ['./transaction.component.scss'],
})

export class RateFeedbackComponent {

  rating: Number;
  feedback;
  isLeased = false;

  constructor(public trasactionService: TransactionService,
    public dialogRef: MatDialogRef<RateFeedbackComponent>,
    public agentService: AgentService,
    @Inject(MAT_DIALOG_DATA) public data: any, ) { }


  rateAndFeedback() {

    if (this.data.buttonConfig === 'Leased') {
      this.isLeased = true;
    }

    this.trasactionService.rateTransaction(this.data.transactionID, +this.rating, this.feedback, this.isLeased);
    this.agentService.computeRating(this.data.agentUid);
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


