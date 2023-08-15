import { Injectable } from '@angular/core';
import 'firebase/compat/database';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private config ={
    apiKey: "AIzaSyDPB23dtxJB_hSiGe26KiHTUwsRcgW2zso",
    authDomain: "esp8266arduino-c7efc.firebaseapp.com",
    databaseURL: "https://esp8266arduino-c7efc-default-rtdb.firebaseio.com",
    projectId: "esp8266arduino-c7efc",
    storageBucket: "esp8266arduino-c7efc.appspot.com",
    messagingSenderId: "138738636628",
    appId: "1:138738636628:web:b37ed112d818845f281ac1",
    measurementId: "G-C09TDSR0CB"
  }

  constructor() { 
    firebase.initializeApp(this.config);
  }

  public getAuth(): firebase.auth.Auth {
    return firebase.auth();
  }

  public getDatabase(): firebase.database.Database {
    return firebase.database();
  }
}
