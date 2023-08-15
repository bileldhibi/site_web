import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
 
  email?:string;
  password?: string;
  nom?: string ;
  prenom?: string ;
  telephone?: string ;
  cin?:string;
  role?: string;
  
  constructor(private auth: AngularFireAuth,private db:AngularFireDatabase, private router: Router) { }

  ngOnInit(): void {
  }

  register() {
    if (!this.email || !this.password || !this.telephone || !this.nom || !this.prenom || !this.cin || !this.role) {
      alert('Tous les champs sont obligatoires');
      return;
    }
  
    // Vérifier si l'utilisateur a le droit de créer un compte administrateur
    if (this.role === 'admin' && this.email !== 'dhibibilel246@gmail.com') {
      alert('Vous n\'avez pas le droit de créer un compte administrateur');
      return;
    }
  
    // Créer un nouvel utilisateur avec l'e-mail et le mot de passe
    this.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
  
        // Définir les données de l'utilisateur dans la base de données
        const userData = {
          nom: this.nom,
          prenom: this.prenom,
          telephone: this.telephone,
          email: this.email,
          cin: this.cin,
          role: this.role // Ajoutez le rôle de l'utilisateur
        };
        const uid = user!.uid;
        await this.db.object(`Users/${uid}`).set(userData);
  
        // Envoyer un e-mail de vérification à l'utilisateur
        if (user != null) {
          await user.sendEmailVerification();
        }
  
        // Afficher un message de réussite et rediriger vers la page de connexion
        alert('Inscription réussie. Un e-mail de vérification a été envoyé à votre adresse e-mail.');
        this.email = '';
        this.password = '';
        this.nom = '';
        this.prenom = '';
        this.telephone = '';
        this.cin = '';
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error(error);
        alert('Une erreur s\'est produite lors de l\'inscription. Veuillez réessayer plus tard.');
      });
  }
  


}

