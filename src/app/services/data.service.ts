import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Machines } from '../model/machines';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private db:AngularFirestore) { }

  //ajouter des machine 
  ajouteMachine(machine:Machines){
    machine.$key=this.db.createId();
    return this.db.collection('/Machine').add(machine);
  }

  // get all machines
  getAllMachines(){
    return this.db.collection('/Machine').snapshotChanges();
  }
  // delete les Machines 
    deleteMachine(machine:Machines){
      return this.db.doc('/Machine'+machine.$key).delete();
     }

   // update machines
   update(machine:Machines){
    this.deleteMachine(machine);
    this.ajouteMachine(machine);
   }  
}
