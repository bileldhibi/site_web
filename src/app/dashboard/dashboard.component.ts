import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MenuItem } from 'primeng/api';
import { AngularFireDatabase ,AngularFireList} from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  newReclamationsCount: number = 0;
  items: MenuItem[]=[];
  sizes = [1, 2, 3, 4, 5];
  reclamationRef: AngularFireList<any>;
  reclamations: Observable<any[]>;
  constructor(private auth:AuthService,private router: Router,private ofAuth:AngularFireAuth,private db:AngularFireDatabase) { }
  
  ngOnInit(): void {
    this.reclamationRef = this.db.list('Reclamation');
    this.reclamations = this.reclamationRef.valueChanges();

    this.reclamations.subscribe(reclamations => {
      this.newReclamationsCount = reclamations.filter(reclamation => !reclamation.read).length;
      this.updateMenuLabel();
    });
        this.items = [
          {
            label: 'Accueil',
            icon: 'pi pi-fw pi-home',
            command: () => this.onSizeSelect8(),
          },
          {
            label: `Message Reclamation (${this.newReclamationsCount})`,
            icon: 'pi pi-fw pi-comment',
            command: () => this.onSizeSelect11(),
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
  }

  register(){
    this.auth.logout();

  }

  
  logout() {
    this.ofAuth.signOut()
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
  onSizeSelect11() {
   
    this.router.navigate(['/reclamation']);
    
  }
  
  updateMenuLabel(): void {
    const messageReclamationMenuItem = this.items.find(item => item.label.includes('Message Reclamation'));
    if (messageReclamationMenuItem) {
      messageReclamationMenuItem.label = `Message Reclamation (${this.newReclamationsCount})`;
    }
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
