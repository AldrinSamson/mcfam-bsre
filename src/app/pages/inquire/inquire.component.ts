import { Component, OnInit } from '@angular/core';
import { MailerService , FirebaseService, AlertService } from '../../shared';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-inquire',
  templateUrl: './inquire.component.html',
  styleUrls: ['./inquire.component.scss']
})
export class InquireComponent implements OnInit {

  client;
  uid;
  message;
  projectCity;
  projectRegion;
  projectPropertyType;
  projectSaleType;

  constructor(
    public firebaseService: FirebaseService,
    public mailerService: MailerService,
    public alertService: AlertService
  ) { }

  ngOnInit() {
    this.uid = sessionStorage.getItem('session-user-uid');
  }

  inquire() {

    this.firebaseService.getOneUid(this.uid , 'client').subscribe( res => {
      this.client = res;
      const load = {
        clientName: this.client[0].fullName,
        clientEmail: this.client[0].email,
        clientContactNumber: this.client[0].contactNumber,
        clientMessage: this.message,
        projectCity: this.projectCity,
        projectRegion: this.projectRegion,
        projectPropertyType: this.projectPropertyType,
        projectSaleType: this.projectSaleType,
        dateSent: new Date(),
        isArchived: false,
        isAssigned: false
      };

      const mailLoad =
      '<h3>Sell Inquiry of' + this.client[0].fullName + '!</h3>'
      + '<br>' +
      '<p> Client Email: ' + this.client[0].email + '</p>'
      + '<br>' +
      '<p> Client Contact Number: ' + this.client[0].contactNumber + '</p>'
      + '<br>' +
      '<p> Address: ' + this.projectCity + ' , ' + this.projectRegion + ' </p>'
      + '<br>' +
      '<p> Property Type: ' + this.projectPropertyType + '</p>'
      + '<br>' +
      '<p> Sale Type: ' + this.projectSaleType + '</p>'
      + '<br>' +
      '<p> Message: </p>'
      + '<br>' +
      '<p> ' + this.message + ' </p>';

      this.firebaseService.addOne(load , 'sellInquiry');
      this.mailerService.sendEmail('mcfamrealty.is@gmail.com' , 'Sell Inquiry of ' + this.client[0].fullName , mailLoad);
      this.alertService.showToaster('Inquiry Sent!');
    });
  }

}
