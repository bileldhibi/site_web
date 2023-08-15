import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TensionflammeService {
  getIpAddress() {
    throw new Error('Method not implemented.');
  }

  constructor(private db: AngularFireDatabase) { }
  
 // Récupérer la valeur du capteur de tension
 getVoltageValue(): Observable<any> {
  return this.db.object('voltage').valueChanges();
}

getFlameValue(): Observable<any> {
  return this.db.object('flamme').valueChanges();
}
getCourantValue(): Observable<any> {
  return this.db.object('courant').valueChanges();
}

}
