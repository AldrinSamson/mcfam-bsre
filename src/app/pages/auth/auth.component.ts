import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@shared';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from '../../shared';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {

  email='';
  passw='';
 
  constructor(private authService: AuthService,
    private router: Router,
    public fbs: FirebaseService,
    public db: AngularFirestore) {}
  
  
  login(){
    this.authService.login(this.email,this.passw).then(() => {
    });
    
  }

}
