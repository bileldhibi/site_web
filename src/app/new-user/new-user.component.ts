import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  items: MenuItem[]=[];
  sizes = [1, 2, 3, 4, 5];

  nom!:string;
  prenom!: string;
  email!: string;
  cin!: string;
  telephone!: string;

  
// Définir une variable pour contrôler l'affichage des champs
showForm = false;


  constructor(private auth: AngularFireAuth, private db: AngularFireDatabase,private Auth:AuthService,private router: Router) { }

  async toggleForm() {
    const authorizedEmail = 'dhibibilel246@gmail.com';
    const currentUser = this.auth.currentUser;
  
    if (currentUser && (await currentUser).email === authorizedEmail) {
      this.showForm = !this.showForm;
      if (this.showForm) {
        alert('Adresse e-mail autorisée. Cliquer à nouveau pour masquer le champ.');
      } else {
        alert('Adresse e-mail autorisée. Cliquer à nouveau pour afficher le champ.');
      }
    } else {
      this.showForm = false;
      alert('Adresse e-mail non autorisée.');
    }
  
  
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

  }
  register() {
    const emailRegex = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
    if (!emailRegex.test(this.email)) {
      alert('Adresse e-mail invalide.');
      return;
    }
    // create user account
    const randomPassword = Math.random().toString(36).slice(-8); // Génère un mot de passe aléatoire de 8 caractères
this.auth.createUserWithEmailAndPassword(this.email, randomPassword)
  .then(async (userCredential) => {
    const user = userCredential.user;

    // Set the user data in the database with unique ID
    const userData = {
      nom: this.nom,
      prenom: this.prenom,
      telephone: this.telephone,
      email: this.email,
      cin: this.cin,
    };
    const uid = user!.uid;
    await this.db.object(`Users/${uid}`).set(userData);

    // Send a password reset email to the user
    if (user != null) {
      await user.sendEmailVerification();
      await this.auth.sendPasswordResetEmail(this.email);
    }
    alert('Inscription réussie. Vérifiez votre e-mail pour le mot de passe.');
    this.nom = '';
    this.prenom = '';
    this.email = '';
    this.cin = '';
    this.telephone = '';
  })
  .catch((error) => {
    alert(error.message);
  });

  }
  private generatePassword(): string {
    // generate random password using lowercase letters and digits
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      const index = Math.floor(Math.random() * chars.length);
      password += chars[index];
    }
    return password;
  }

  register1(){
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
  canActivate(): Observable<boolean> {
    return this.Auth.authState.pipe(
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
