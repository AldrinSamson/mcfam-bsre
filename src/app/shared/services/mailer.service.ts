import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MailerService {

  constructor(
    public http: HttpClient
  ) { }

  sendEmail(email , subject , message ) {
    const url = 'https://us-central1-mcfam-systems.cloudfunctions.net/sendMail';
    const body : any = {
      'email' : email,
      'subject' : subject,
      'message' : message,
    }
    let output = <JSON>body;
    let httpOptions = {
      responseType: 'text' as 'json'
    }
    return this.http.post<any>(url , <JSON>output , httpOptions ).subscribe({
      error: error => console.error('There was an error!', error)
    })
  }
}
