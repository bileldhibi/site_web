import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Router } from '@angular/router';
import { FormGroup,FormBuilder,FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

   email:string='';
   password:string='';
  loginForm!:FormGroup;

  constructor(private Auth:AuthService,private afAuth: AngularFireAuth, private router: Router,private fb:FormBuilder) { }

  ngOnInit(): void {
    this.iniform();
  }
  iniform(){
    this.loginForm=this.fb.group({
      email:new FormControl('',[
        Validators.required,
        Validators.email
      ]),
      password:new FormControl('',[
        Validators.required,
        Validators.minLength(8)
      ])
    })
  }
  get email1(){
    return this.loginForm.get('email')
  }

  get password1(){
    return this.loginForm.get("password")
  }



  

  login(){
    if(this.email==''){
        alert("veuillez saisir un é-mail");
        return;
    }

    if(this.password==''){
      alert("veuillez entrer le mot de passe");
      return;
  }
  this.Auth.login({ email: this.email, password: this.password });
  this.email='';
  this.password='';
}
  
google(){
  this.Auth.signInWithGoogle();
}

async login1() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    this.router.navigate(['/dashboard']);
  } catch (error) {
    console.log(error);
  }
}

withgoogle(){
  this.Auth.googleSi();
}


}
