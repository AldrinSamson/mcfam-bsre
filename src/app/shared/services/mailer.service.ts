import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MailerService {

  constructor(
    public http: HttpClient,
    public db: AngularFirestore
  ) { }

  sendEmail(email , subject , message ) {
    const url = 'https://us-central1-mcfam-systems.cloudfunctions.net/sendMail';
    const body: any = {
      'email' : email,
      'subject' : subject,
      'message' : message,
    };
    const output = <JSON>body;
    const httpOptions = {
      responseType: 'text' as 'json'
    };
    return this.http.post<any>(url , <JSON>output , httpOptions ).subscribe({
      error: error => console.error('There was an error!', error)
    });
  }

  genTransactionMessage(role: any, stage: any, project: String, otherValues?: Array<any>) {

    let subject: String;
    let message: String;
    const content = [];

    const header = '<img _ngcontent-arm-c2="" src="https://firebasestorage.googleapis.com/v0/b/mcfam-systems.appspot.com/o/broker%2FstoreFile1587285467947_image.png?alt=media&token=ebf3e94d-3df2-485c-a03e-dbdf7e63e06c">';
    const footer = '&copy; 2020 MCFam Reality. All rights Reserved.'
                  + '<br>' +
                  'Insert Address here'
                  + '<br>' +
                  'Sales Hotline: insert Number';

  switch (stage && role) {

    case 2 && 'manager':

      subject = 'Client has Uploaded Documents';
      message = header +
              '<p> Client ' + otherValues[0] +  ', has uploaded the required documents for their transaction on ' + project + '. </p>'
              + footer;
      content.push(subject);
      content.push(message);
      return content;

    case 'cancelled' && 'agent':

      subject = 'Cancelled Transaction on ' + project + '';
      message = header +
                '<p>' + otherValues[0] + 'has cancelled their request. </p>'
                + footer;

      content.push(subject);
      content.push(message);
      return content;

    case 'cancelled' && 'manager':

      subject = 'Cancelled Transaction on ' + project + '';
      message = header +
                '<p>' + otherValues[0] + 'has cancelled their request. </p>'
                + footer;

      content.push(subject);
      content.push(message);
      return content;

    case 5 && 'agent':

      subject = 'Client ' + otherValues[0] + ' has submitted an feedback';
      message = header +
                '<p> Rating: ' + otherValues[1] + ' <br> Feedback: ' + otherValues[2] + ' </p>'
                + footer;

      content.push(subject);
      content.push(message);
      return content;
    }
  }

  mailTransactionMessage( destUid: string , role: string, stage: any, project: string, otherValues?: Array<any>) {

    let content = [];
    let email: any;
    let table = 'broker';
    let getEmail: Subscription;

    if ( role === 'client') {
      table = 'client';
    }

    if (otherValues == null) {
      content = this.genTransactionMessage(role, stage, project);
    } else {
      content = this.genTransactionMessage(role, stage, project, otherValues);
    }

    getEmail = this.db.collection(table, ref => ref.where('email', '==', destUid)).valueChanges().subscribe( (res: any) => {
      email = res[0].email;
      this.sendEmail(email , content[0] , content[1]);
      getEmail.unsubscribe();
    });
  }
}
