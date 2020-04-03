// Modules 3rd party
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 404 page
import { PageNotFoundComponent } from './pages/not-found/not-found.component';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { AboutMeComponent } from './pages/about-me/about-me.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AuthComponent } from './pages/auth/auth.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileSettingsComponent } from './pages/profile/profile-settings.component';
import { ProjectComponent } from './pages/project/project.component';
import { TransactionComponent } from './pages/transaction/transaction.component';
import { InquireComponent } from './pages/inquire/inquire.component';
import { AgentComponent } from './pages/agent/agent.component';
import { EditFeatureComponent } from './pages/home/edit-feature/edit-feature.component'
import { ViewProjectComponent } from './pages/view-project/view-project.component';
// Components
import { MiscComponent } from './components/misc/misc.component';

// Protected
import { AuthGuardService } from '@shared';


// Routing
const appRoutes: Routes = [

  // Public pages
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'edit-feature', component: EditFeatureComponent },
  { path: 'about', component: AboutMeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'misc', component: MiscComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'project', component: ProjectComponent },
  { path: 'agent', component: AgentComponent },
  // Protected pages
  // { path: 'profile/:uid/:name', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'transaction', component: TransactionComponent, canActivate: [AuthGuardService] },
  { path: 'project/:id', component: ViewProjectComponent },
  { path: 'inquire', component: InquireComponent, canActivate: [AuthGuardService] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'profile-settings', component: ProfileSettingsComponent, canActivate: [AuthGuardService] },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
