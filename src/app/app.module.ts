import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {FormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgetComponent } from './forget/forget.component';
import { VerifieEmailComponent } from './verifie-email/verifie-email.component';
import { MenubarModule } from 'primeng/menubar';
import { AjoutelistComponent } from './ajoutelist/ajoutelist.component';
import { UpdateComponent } from './update/update.component';
import { ListeUsersComponent } from './liste-users/liste-users.component';
import { DeleteComponent } from './delete/delete.component';
import { ProfilComponent } from './profil/profil.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NewUserComponent } from './new-user/new-user.component';
import { ConsommationComponent } from './consommation/consommation.component';
import { ButtonModule } from 'primeng/button';
import { ConversationComponent } from './conversation/conversation.component';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { VoltageComponent } from './voltage/voltage.component';
import { NgChartsModule } from 'ng2-charts';
import { ReclamationComponent } from './reclamation/reclamation.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    ForgetComponent,
    VerifieEmailComponent,
    AjoutelistComponent,
    UpdateComponent,
    ListeUsersComponent,
    DeleteComponent,
    ProfilComponent,
    NewUserComponent,
    ConsommationComponent,
    ConversationComponent,
    VoltageComponent,
    ReclamationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    FormsModule,
    MenubarModule,
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    CommonModule,
    NgChartsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
