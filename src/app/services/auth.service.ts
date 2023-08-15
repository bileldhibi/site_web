import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import {GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider} from '@angular/fire/auth'
import * as firebase from 'firebase/compat';
import 'firebase/compat/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: any;
  getCurrentUserEmail(): string {
    throw new Error('Method not implemented.');
  }
    authState: any;
    signOut() {
        throw new Error('Method not implemented.');
    }

  constructor(private fireauth : AngularFireAuth, private router : Router) {}

    //login
    login({ email, password }: { email: string; password: string; }){
      this.fireauth.signInWithEmailAndPassword(email,password).then( res=>{
        localStorage.setItem('token','true');
        if(res.user?.emailVerified == true){
          this.router.navigate(['dashboard']);
        }else{
          this.router.navigate(['/verifie-email']);
        }

      }, err =>{
        alert("Veuillez confirmer que le mot de passe est valide");
        this.router.navigate(['/login']);
      })
    } 

    //register
    // register({ email, password }: { email: string; password: string; }){
    //   this.fireauth.createUserWithEmailAndPassword(email,password).then( ()=>{
    //   alert("inscription réussie");
    //   this.router.navigate(['/login']);

    //   }, err=>{
    //     alert(err.message);
    //     this.router.navigate(['/register']);

    //   })
    // }

    //sign out
  logout(){
    this.fireauth.signOut().then( ()=>{
     localStorage.removeItem('token');
     this.router.navigate(['/login']);
    }, err=>{
      alert(err.message);

    })
  }

  //forget mdp
  forget(email:string){
      this.fireauth.sendPasswordResetEmail(email).then( ()=>{
           this.router.navigate(['/verifie-email']);
      },err =>{
            alert("quelque chose s'est mal passé");
      })
  }

  // sendEmail(user:any){
  //   user.sendEmail((res:any)=>{
  //     this.router.navigate(['/verifie-email']);
  //   },(err:any)=>{
  //     alert("pas en mesure d'envoyer un courrier à votre adresse e-mail");
  //   })

  // }

  //google
//   google(){
//     return this.fireauth.signInWithPopup(new GoogleAuthProvider).then( res=>{
//         this.router.navigate(['/dashboard']);
//         localStorage.setItem('token',JSON.stringify(res.user?.uid));
//     }, err=>{
//       alert("erreur");
//     })
//   }
signInWithGoogle() {
  return this.fireauth.signInWithPopup(new GoogleAuthProvider()).then(res => {
      this.router.navigate(['/dashboard']);
      localStorage.setItem('token', JSON.stringify(res.user?.uid));
  }, err => {
      alert("Error occurred.");
  })
}


googleSi(){
  return this.fireauth.signInWithPopup(new GoogleAuthProvider).then(res1 =>{
    this.router.navigate(['/dashboard']);
    localStorage.setItem('token', JSON.stringify(res1.user?.uid));

  },erreur=>{
    alert(erreur.message);
  })
}



 }
