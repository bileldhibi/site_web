import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthsService } from '../services/auths.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {
  currentUser: firebase.User | null = null;
  
  items: MenuItem[]=[];
  sizes = [1, 2, 3, 4, 5];
  constructor(private authService:AuthsService ,private router: Router, private afAuth: AngularFireAuth,private auth:AuthService) { 

  }
  

  ngOnInit(): void {

    this.items = [
      {
        label: 'Accueil',
        icon: 'pi pi-fw pi-home',
        command: () => this.onSizeSelect8(),
      },
        
        {
            label: 'Modifier',
            icon: 'pi pi-fw pi-pencil',
            items: [
               
                
                {
                    label: 'profil',
                    icon: 'pi pi-fw pi-user-edit',
                    command: () => this.onSizeSelect4(),
                },
                
            ]
        },
        {
            label: 'utilisateurs',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'Nouveau',
                    icon: 'pi pi-fw pi-user-plus',
                    command: () => this.onSizeSelect5(),
                },
                {
                    label: 'Supprimer',
                    icon: 'pi pi-fw pi-user-minus',
                    command: () => this.onSizeSelect3(),
                },
                {
                    label: "Liste ",
                    icon: 'pi pi-fw pi-users',
                    command: () => this.onSizeSelect(),
                }
            ]
        },
        {
            label: 'machine',
            icon: 'pi pi-fw pi-desktop',
            items: [
                {
                    label: 'Modifier',
                    icon: 'pi pi-fw pi-pencil',
                    items: [
                        {
                            label: 'Liste des machines',
                            icon: 'pi pi-fw pi-table',
                            command: () => this.onSizeSelect1(),
                        },
                        {
                          label: 'CONTRÔLE',
                          icon: 'pi pi-fw  pi-external-link',
                          command: () => this.onSizeSelect6(),
                      },
                      {
                        label: 'Voltage',
                        icon: 'pi pi-fw pi-bolt',
                        command: () => this.onSizeSelect10(),
                    }
                    ]
                },
                
                
            ]
        },
        
      {
        label: 'Déconnexion',
        icon: 'pi pi-fw pi-power-off',
        command: () => this.logout(),
        styleClass: 'end',
      }
    ];


    this.afAuth.authState.subscribe(user => {
      this.currentUser = user;
    });

}

async deleteUser() {
  try {
    await this.authService.deleteCurrentUser();
    this.router.navigate(['/login']);
  } catch (error) {
    console.log(error);
  }
}



register(){
  this.auth.logout();

}


logout() {
  this.afAuth.signOut()
    .then(() => {
      this.router.navigate(['/login']);
    });
}

onSizeSelect() {
 
  this.router.navigate(['/liste-users']);
  
}

onSizeSelect1() {
 
  this.router.navigate(['/ajoutelist']);
  
}

onSizeSelect2() {
 
  this.router.navigate(['/update']);
  
}

onSizeSelect3() {
 
  this.router.navigate(['/delete']);
  
}
onSizeSelect4() {
 
  this.router.navigate(['/profil']);
  
}

onSizeSelect5() {
 
  this.router.navigate(['/new-user']);
  
}
onSizeSelect6() {
 
  this.router.navigate(['/consommation']);
  
}

onSizeSelect7() {
 
  this.router.navigate(['/conversation']);
  
}

onSizeSelect8() {
 
  this.router.navigate(['/dashboard']);
  
}
onSizeSelect10() {
 
  this.router.navigate(['/voltage']);
  
}
canActivate(): Observable<boolean> {
  return this.auth.authState.pipe(
    map(user => {
      if (user) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    })
  );
}


}

  

