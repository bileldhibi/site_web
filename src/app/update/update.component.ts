import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Machines } from '../model/machines';
import { MachineService } from '../services/machine.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  machines:Machines[]=[];
  newMachine: Machines = {
    nomMachine: '',
    status: '',
    description: ''
  };
  selectedMachine: Machines | null = null; 

  constructor(private db: AngularFireDatabase,private machineService:MachineService) { }

  ngOnInit(): void {
    this.loadMachines();
  }

  loadMachines(): void {
    this.machineService.getMachines().subscribe((Machine: Machines[]) => {
      this.machines = Machine;
    });
  }

  addMachine(): void {
    this.machineService.addMachine(this.newMachine)
      .then(() => {
        console.log('Machine ajoutée avec succès!');
        alert('Machine ajoutée avec succès!');
        this.newMachine = {
          nomMachine: '',
          status: '',
          description: ''
        };
      })
      .catch((error) => {
        console.log('Erreur lors de l\'ajout de la machine:', error);
        alert('Erreur lors de l\'ajout de la machine!');
      });
  }

  updateMachine(): void {
    if (this.selectedMachine) {
      this.machineService.updateMachine(this.selectedMachine)
        .then(() => {
          console.log('Machine mise à jour avec succès!');
          alert('Machine mise à jour avec succès!');
          this.selectedMachine = null;
        })
        .catch((error) => {
          console.log('Erreur lors de la mise à jour de la machine:', error);
          alert('Erreur lors de la mise à jour de la machine!');
        });
    } else {
      console.log('Erreur lors de la mise à jour de la machine: ID manquant');
      alert('Erreur lors de la mise à jour de la machine: ID manquant');
    }
   
  }

 
}
