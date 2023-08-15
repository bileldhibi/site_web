import { Component, OnInit,Inject  } from '@angular/core';
import { AngularFireDatabase, AngularFireList  } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { TensionflammeService } from '../services/tensionflamme.service';
import { MenuItem } from 'primeng/api';
import { NetificationService } from '../services/netification.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';



@Component({
  selector: 'app-consommation',
  templateUrl: './consommation.component.html',
  styleUrls: ['./consommation.component.css']
})
export class ConsommationComponent implements OnInit {
  showVoltage: boolean = false;
  items: MenuItem[]=[];
  sizes = [1, 2, 3, 4, 5];
  
  flameSensorValue: boolean = false;
  notification: boolean = false;
  flameSensorRef: any;

  voltageValue: any;
  flameValue: any;
  CourantValue: any;
  dateHeure: string;
  
  adresseIP:string;

  voltageValues$: Observable<any[]>;
  courantMessage: string;
  courantColor: string;

  courant1: string;
  courant1Color: string;
  courantValues: number[] = [];
  showHistorique = false;

  voltageText: string;
  textColor: string;

  nomMachineTextView: string;
  adresseMacTextView: string;
  databaseReference: AngularFireList<any>;
  ref: AngularFireDatabase;
  historique: string = '';
  afficherHistorique: boolean = false;
  historique1: string = '';
  afficherHistoriqueVoltage: boolean = false;
  constructor(private firebaseService:TensionflammeService,private db: AngularFireDatabase,private firebaseServices:NetificationService,private router: Router,private ofAuth:AngularFireAuth) {
    this.nomMachineTextView = '';
    this.adresseMacTextView = '';
    this.databaseReference = db.list('/Machine');
    this.ref = db;

    //voltage
    const voltageRef = this.db.list('voltage');
    voltageRef.valueChanges().subscribe((data: unknown[]) => {
      const voltages = data as number[]; // Effectuer une vérification de type

      if (voltages.length === 0) {
        this.voltageText = 'Aucune valeur de tension trouvée';
        this.textColor = 'red';
      } else {
        const lastVoltage = voltages[voltages.length - 1];
        const voltageValue = `valeur de tension est : ${lastVoltage.toFixed(3)} V`;
        if (lastVoltage === 0) {
          this.voltageText = voltageValue;
          this.textColor = 'red';
        } else {
          this.voltageText = voltageValue;
          this.textColor = 'black';
        }
      }
    });
    //
    this.courant1 = '';
    this.courant1Color = '';
    this.getDataFromFirebase1();

    
    this.voltageValues$ = this.db.list('voltage').valueChanges();


    // Récupérer la adresse_mac depuis la base de données Firebase
    this.db.object<string>('adresse_mac').valueChanges().subscribe(value => {
      this.adresseIP = value;
    });

    // Récupérer la date depuis la base de données Firebase
    this.db.object<string>('dateHeure').valueChanges().subscribe(value => {
      this.dateHeure = value;
    });

   

    this.flameSensorRef = this.db.object('flamme').valueChanges();
    this.flameSensorRef.subscribe((value: boolean) => {
      if (value === true) {
        this.notification = true;
      } else {
        this.notification = false;
      }
    });
   }
  getDataFromFirebase() {
    throw new Error('Method not implemented.');
  }


   showVoltageValues() {
    this.showVoltage = !this.showVoltage;
  }

  //courant
  Historique(): void {
    const courantRef = this.db.database.ref('courant');
    const dateHeureRef = this.db.database.ref('dateHeureCourant');

    courantRef.once('value').then(snapshot => {
      const valeurCourant1: any[] = [];
      snapshot.forEach(dataSnapshot => {
        const valeur1 = dataSnapshot.val();
        valeurCourant1.push(valeur1);
      });

      dateHeureRef.once('value').then(snapshot => {
        let histo = '';
        let i = 0;
        snapshot.forEach(dataSnapshot => {
          const dateHeure1 = dataSnapshot.val();
          const courantDouble = valeurCourant1[i];

          histo += `Valeur courant: ${courantDouble.toFixed(3)} A, Date et Heure: ${dateHeure1}<br>`;
          i++;
        });

        // Mettre à jour la variable historique avec la valeur calculée
        this.historique = histo;
        // Inverser l'état d'affichage
        this.afficherHistorique = !this.afficherHistorique;
      });
    });
  }

  //voltge
  Historique1(): void {
    const courantRef = this.db.database.ref('voltage');
    const dateHeureRef = this.db.database.ref('dateHeureVoltage');

    courantRef.once('value').then(snapshot => {
      const valeurCourant1: any[] = [];
      snapshot.forEach(dataSnapshot => {
        const valeur1 = dataSnapshot.val();
        valeurCourant1.push(valeur1);
      });

      dateHeureRef.once('value').then(snapshot => {
        let histo = '';
        let i = 0;
        snapshot.forEach(dataSnapshot => {
          const dateHeure1 = dataSnapshot.val();
          const courantDouble = valeurCourant1[i];

          histo += `Valeur tension: ${courantDouble.toFixed(3)} V, Date et Heure: ${dateHeure1}<br>`;
          i++;
        });

        // Mettre à jour la variable historique avec la valeur calculée
        this.historique1 = histo;
        // Inverser l'état d'affichage
        this.afficherHistoriqueVoltage = !this.afficherHistoriqueVoltage;
      });
    });
  }

  ngOnInit(): void {
    this.databaseReference.snapshotChanges().subscribe(actions => {
      actions.forEach(action => {
        const numero = action.payload.child('numero').val();
        const nomMachine = action.payload.child('nomMachine').val();

        // Vérification de la condition
        if (numero != null && numero === 1) {
          this.nomMachineTextView = nomMachine;
        }
      });
    });

    this.ref.object('/adresse_mac').valueChanges().subscribe(adresseMac => {
      this.adresseMacTextView = 'Adresse Physique : ' + adresseMac;
    });

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



    this.firebaseService.getVoltageValue().subscribe(value => {
      this.voltageValue = value;
    });

    this.firebaseService.getFlameValue().subscribe(value => {
      this.flameValue = value;
    });

  

  }
  onFlameSensorChange() {
    this.db.object('flamme').set(this.flameSensorValue);
  }
 

  
  logout() {
    this.ofAuth.signOut()
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
  formatVoltageValue(value: number): string {
    return value.toFixed(2);
  }

  getDataFromFirebase1() {
    const reference = this.db.database.ref();
    reference.on('value', snapshot => {
      const courantSnapshot: any[] = [];
      snapshot.child('courant').forEach(child => {
        courantSnapshot.push(child.val());
      });

      const Courantsnpshot2 = courantSnapshot[courantSnapshot.length - 1];
      const CourantSN: number = Courantsnpshot2;

      const courant2 = 'valeur de courant est : ' + CourantSN.toFixed(3) + ' A';

      if (CourantSN === 0) {
        this.courantMessage='Les coupures de courant sur les machines doivent être résolues rapidement';
        this.courant1 = courant2;
        this.courantColor = "text-danger";
      } else {
        this.courant1 = courant2;
        this.courantMessage='';
        this.courantColor = "text-success";
      }
    });
  }


  toggleHistorique() {
    if (this.showHistorique) {
      this.clearHistorique();
    } else {
      this.loadHistorique();
    }
  }

  loadHistorique() {
    const reference = this.db.database.ref('courant');
    reference.once('value').then(snapshot => {
      this.courantValues = []; // Efface les anciennes valeurs avant de charger les nouvelles
      snapshot.forEach(childSnapshot => {
        const courantValue = childSnapshot.val();
        this.courantValues.push(courantValue);
      });
      this.showHistorique = true;
    });
  }

  clearHistorique() {
    this.courantValues = [];
    this.showHistorique = false;
  }

// les valeur de voltage 

}
 


