import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase,AngularFireList } from '@angular/fire/compat/database';
import { map, Observable, take } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-ajoutelist',
  templateUrl: './ajoutelist.component.html',
  styleUrls: ['./ajoutelist.component.css']
  
})
export class AjoutelistComponent implements OnInit {
 
  machinesRef: AngularFireList<any>;
  machines$: Observable<any[]>;
  newMachine: any = {};
  editedMachine: any = {};
  currentUserEmail?: string;
  showForm = false; 
  items: ({ label: string; icon: string; command: () => void; items?: undefined; badge?: undefined; badgeStyleClass?: undefined; styleClass?: undefined; } | { label: string; icon: string; items: { label: string; icon: string; command: () => void; }[]; command?: undefined; badge?: undefined; badgeStyleClass?: undefined; styleClass?: undefined; } | { label: string; icon: string; items: { label: string; icon: string; items: { label: string; icon: string; command: () => void; }[]; }[]; command?: undefined; badge?: undefined; badgeStyleClass?: undefined; styleClass?: undefined; } | { label: string; icon: string; badge: string; badgeStyleClass: string; command: () => void; items?: undefined; styleClass?: undefined; } | { label: string; icon: string; command: () => void; styleClass: string; items?: undefined; badge?: undefined; badgeStyleClass?: undefined; })[];
  currentUserRole: string | undefined;
  constructor(private db: AngularFireDatabase,private auth :AngularFireAuth,private router: Router,private Auth:AuthService  ) { 
   
    this.machinesRef = db.list('Machine');
    this.machines$ = this.machinesRef.snapshotChanges().pipe(
      map((changes: any[]) =>
        changes.map((c: any) => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );

    this.auth.authState.subscribe(user => {
      if (user) {
        if (typeof user.email === 'string') { // check if email is a string
          this.currentUserEmail = user.email;
        }
      }
    });

  }

  async ngOnInit(): Promise<void> {
    // Récupérer le rôle de l'utilisateur à partir de la base de données Firebase
  const uid = (await this.auth.currentUser)?.uid;
  if (uid) {
    this.db.object(`Users/${uid}/role`).valueChanges().pipe(take(1)).subscribe((roleSnapshot) => {
      this.currentUserRole = roleSnapshot?.toString();
    });
  }
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
  }

  addMachine() {
    if (this.currentUserRole === 'admin') { // Vérifier si le rôle de l'utilisateur est "admin"
      if (this.newMachine.numero && this.newMachine.nomMachine && this.newMachine.description && this.newMachine.status && this.newMachine.Coefficient) {
        this.machinesRef.push(this.newMachine)
          .then(() => {
            alert('Données ajoutées avec succès');
            this.newMachine = {};
          })
          .catch((error: any) => {
            console.log('Erreur d\'ajout : ', error);
          });
      } else {
        alert('Veuillez remplir tous les champs');
      }
    } else {
      alert('Vous n\'êtes pas autorisé à ajouter des machines');
    }
  }
  
  deleteMachine(key: string) {
    if (this.currentUserRole === 'admin') {
      this.machinesRef.remove(key)
        .then(() => {
          alert('Suppression réussie');
        })
        .catch((error :any) => {
          console.log('Erreur de suppression : ', error);
        });
    } else {
      alert('Vous n\'êtes pas autorisé à supprimer des machines');
    }
  }

  
  editMachine(machine: any) {
    if (this.currentUserRole === 'admin') {
      this.editedMachine.key = machine.key;
      this.editedMachine.numero = machine.numero;
      this.editedMachine.nomMachine = machine.nomMachine;
      this.editedMachine.description = machine.description;
      this.editedMachine.status = machine.status;
      this.editedMachine.Coefficient = machine.Coefficient;
    } else {
      alert('Vous n\'êtes pas autorisé à modifier des machines');
    }
  }

  updateMachine() {
    if (this.currentUserRole === 'admin') {
      const { key,numero, nomMachine, description, status, Coefficient } = this.editedMachine;
      this.machinesRef.update(key, { numero, nomMachine, description, status, Coefficient });
      this.editedMachine = {};
    } else {
      alert('Vous n\'êtes pas autorisé à modifier des machines');
    }
  }

  cancelEdit() {
    this.editedMachine = {};
  }




  //
  register(){
    this.Auth.logout();

  }

  
  logout() {
    this.auth.signOut()
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
}


