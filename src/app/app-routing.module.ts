import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgetComponent } from './forget/forget.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifieEmailComponent } from './verifie-email/verifie-email.component';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AjoutelistComponent } from './ajoutelist/ajoutelist.component';
import { UpdateComponent } from './update/update.component';
import { ListeUsersComponent } from './liste-users/liste-users.component';
import { DeleteComponent } from './delete/delete.component';
import { ProfilComponent } from './profil/profil.component';
import { NewUserComponent } from './new-user/new-user.component';
import { ConsommationComponent } from './consommation/consommation.component';
import { ConversationComponent } from './conversation/conversation.component';
import { VoltageComponent } from './voltage/voltage.component';
import { ReclamationComponent } from './reclamation/reclamation.component';

const routes: Routes = [
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'forget',component:ForgetComponent},
  {path:'verifie-email',component:VerifieEmailComponent},
  {path:'ajoutelist',component:AjoutelistComponent},
  {path:'update',component:UpdateComponent},
  {path:'liste-users',component:ListeUsersComponent},
  {path:'delete',component:DeleteComponent},
  {path:'profil',component:ProfilComponent},
  {path:'new-user',component:NewUserComponent},
  {path:'consommation',component:ConsommationComponent},
  {path:'conversation',component:ConversationComponent},
  {path:'voltage',component:VoltageComponent},
  {path:'reclamation',component:ReclamationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
