import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MailerService } from '../../shared';
import { UserService } from '@shared';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {

  name = '';
  email = '';
  subject = '';
  message = '';

  constructor(private userService: UserService , public mailerService: MailerService) {}

  sendMail() {
    const mailLoad = '<p>From: ' + this.name + '<br> Email: ' + this.email + '</p><p> ' + this.message + ' </p>';
    this.mailerService.sendEmail('mcfamrealty.is@gmail.com' , this.subject , mailLoad);
  }

}
