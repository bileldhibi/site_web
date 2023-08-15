import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/compat';
import 'firebase/database';
import { initializeApp } from 'firebase/app';
import { getDatabase , ref, onValue, remove, update} from 'firebase/database';
import { getAuth } from 'firebase/auth';
import {  deleteUser } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable,of  } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { switchMap, map, filter, toArray } from 'rxjs/operators';
import 'firebase/auth';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import {Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
@Component({
  selector: 'app-liste-users',
  templateUrl: './liste-users.component.html',
  styleUrls: ['./liste-users.component.css']
})
export class ListeUsersComponent implements OnInit {
  items: MenuItem[]=[];
  sizes = [1, 2, 3, 4, 5];
  users: any[] = [];

  userEmail?: string;
 
  users1?: Observable<any[]>;
  isAdmin: boolean = false;
  emails: string[] = [];
  currentUserEmail?: string;
  connectedUser: any;


  nom!:string;
  prenom!: string;
  email!: string;
  cin!: string;
  telephone!: string;

  isAdminUser = false;
  // Définir une variable pour contrôler l'affichage des champs
  showForm = false;

  constructor(private afAuth: AngularFireAuth,private kauth:AuthService,private router: Router,private db:AngularFireDatabase) {
    


    initializeApp({
      // Replace with your Firebase project configuration
      apiKey: "AIzaSyDPB23dtxJB_hSiGe26KiHTUwsRcgW2zso",
      authDomain: "esp8266arduino-c7efc.firebaseapp.com",
      databaseURL: "https://esp8266arduino-c7efc-default-rtdb.firebaseio.com",
      projectId: "esp8266arduino-c7efc",
      storageBucket: "esp8266arduino-c7efc.appspot.com",
      messagingSenderId: "138738636628",
      appId: "1:138738636628:web:b37ed112d818845f281ac1",
      measurementId: "G-C09TDSR0CB"
    });
    

    // this.afAuth.authState.subscribe((user) => {
    //   if (user ) {
    //     const db = getDatabase();
    //     const usersRef = ref(db, 'Users');
    //     onValue(usersRef, (snapshot) => {
    //       const users: any[] = [];
    //       snapshot.forEach((childSnapshot) => {
    //         const user = {
    //           id: childSnapshot.key,
    //           ...childSnapshot.val()
    //         };
    //         users.push(user);
    //       });
    //       this.users = users;
    //     });
    //   }
    // });

    //auth
    this.afAuth.authState.subscribe(user => {
      if (user) {
        const db = getDatabase();
        const usersRef = ref(db, 'Users');

        onValue(usersRef, snapshot => {
          const users: any[] = [];
          snapshot.forEach(childSnapshot => {
            const user = {
              id: childSnapshot.key,
              ...childSnapshot.val()
            };
            users.push(user);
          });

          this.users = users;

          // Vérifier si l'utilisateur actuel a le rôle d'admin
          const currentUser = users.find(u => u.id === user.uid);
          this.isAdminUser = currentUser?.role === 'admin';

          // Si l'utilisateur n'est pas un admin, afficher une alerte
          if (!this.isAdminUser) {
            alert("Vous n'êtes pas autorisé à accéder à ces données.");
           this.users = []
          }
        });
      }
    });
    
}


//ajoute ouvrier 
async toggleForm() {
  const currentUser = await this.afAuth.currentUser;
  if (!currentUser) {
    return;
  }

  if (!this.isAdminUser) {
    alert("Non autorisé");
    return;
  }

  this.showForm = !this.showForm;
}






cancel(){
  this.showForm = false;
}

//

//


deleteUser1(id: string) {
  const db = getDatabase();
  const userRef = ref(db, `Users/${id}`);
  remove(userRef);
}

updateUser(user: any) {
  const db = getDatabase();
  const userRef = ref(db, `Users/${user.id}`);
  update(userRef, {
    prenom: user.prenom,
    nom: user.nom,
    telephone: user.telephone,
    cin: user.cin
  });
  user.editable = false; // Disable editing mode after updating
}

cancelUpdate(user: any) {
  // Restore the original values by refreshing the data from the server
  const db = getDatabase();
  const userRef = ref(db, `Users/${user.id}`);
  onValue(userRef, (snapshot) => {
    user.prenom = snapshot.val().prenom;
    user.nom = snapshot.val().nom;
    user.telephone = snapshot.val().telephone;
    user.cin = snapshot.val().cin;
  });
  user.editable = false; // Disable editing mode
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

    this.users1 = this.afAuth.authState.pipe(
      map((user) => {
        if (user && user.email) {
          this.currentUserEmail = user.email;
          return [{ email: user.email }];
        } else {
          return [];
        }
      })
    );

   
  }

  

  register(){
    this.kauth.logout();

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
    return this.kauth.authState.pipe(
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

// Ajoute ouvrier 
  register1() {
    const emailRegex = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
    if (!emailRegex.test(this.email)) {
      alert('Adresse e-mail invalide.');
      return;
    }
    // create user account
    const randomPassword = Math.random().toString(36).slice(-8); // Génère un mot de passe aléatoire de 8 caractères
this.afAuth.createUserWithEmailAndPassword(this.email, randomPassword)
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
      await this.afAuth.sendPasswordResetEmail(this.email);
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

}


