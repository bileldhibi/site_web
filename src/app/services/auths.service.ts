import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthsService {

  constructor(private afAuth: AngularFireAuth) { }

  async deleteCurrentUser() {
    const currentUser = await this.afAuth.currentUser;
    if (currentUser) {
      await currentUser.delete();
      console.log('User deleted successfully');
    } else {
      console.log('No user is currently logged in');
    }
  }
}
