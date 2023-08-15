import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Machines } from '../model/machines';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  constructor(private db: AngularFireDatabase) { }

  addMachine(machine:Machines) {
    return this.db.list('/Machine').push(machine);
  }

  updateMachine(machine: Machines): Promise<void> {
    const machineRef = this.db.object(`/Machine/${machine.id}`);
    return machineRef.update(machine);
  }

  // Obtenir la liste des machines
  getMachines(): any {
    return this.db.list('/Machine').valueChanges();
  }
}
