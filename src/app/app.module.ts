// Modules 3rd party
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireStorage } from 'angularfire2/storage';
import { CarouselModule } from 'ngx-owl-carousel-o';

// Modules
import { AuthModule } from './pages/auth/auth.module';
import { ProfileModule } from './pages/profile/profile.module';
import { MiscModule } from './components/misc/misc.module';
import { PipesModule } from '@shared/pipes/pipes.module';

// Shared
import { FooterComponent, HeaderComponent, UserService, AlertService, AuthGuardService, AuthService, WindowService, FileService } from '@shared';

// Main
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { firebaseKeys } from './firebase.config';

// Pages
import { AboutMeComponent } from './pages/about-me/about-me.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PageNotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { ProjectComponent } from './pages/project/project.component';
import { TransactionComponent , ViewSaleTransactionComponent , UploadDocumentComponent , EditDocumenComponent , RateFeedbackComponent } from './pages/transaction/transaction.component';
import { InquireComponent } from './pages/inquire/inquire.component';
import { EmailMeComponent } from './components/email-me/email-me.component';
import { AgentComponent } from './pages/agent/agent.component';
import { EditFeatureComponent } from './pages/home/edit-feature/edit-feature.component';
import { ViewProjectComponent } from './pages/view-project/view-project.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {AngularFireStorageModule } from 'angularfire2/storage';


@NgModule({
  entryComponents: [
    ViewSaleTransactionComponent,
    UploadDocumentComponent,
    EditDocumenComponent,
    RateFeedbackComponent
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    AboutMeComponent,
    ContactComponent,
    HeaderComponent,
    FooterComponent,
    ProjectComponent,
    PageNotFoundComponent,
    EmailMeComponent,
    TransactionComponent,
    InquireComponent,
    AgentComponent,
    ViewSaleTransactionComponent,
    UploadDocumentComponent,
    EditDocumenComponent,
    EditFeatureComponent,
    ViewProjectComponent,
    RateFeedbackComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    PipesModule,
    AuthModule,
    ProfileModule,
    MiscModule,
    MaterialModule,
    CarouselModule,
    AngularFireModule.initializeApp(firebaseKeys),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  providers: [
    UserService,
    AlertService,
    AuthGuardService,
    AuthService,
    WindowService,
    //FileService,
    AngularFireStorage
    ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
