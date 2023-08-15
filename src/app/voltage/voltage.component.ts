import { Component, OnInit ,ElementRef, ViewChild } from '@angular/core';
import { AngularFireDatabase,AngularFireList, SnapshotAction } from '@angular/fire/compat/database';
import { map, Observable } from 'rxjs';
import { Chart } from 'chart.js';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-voltage',
  templateUrl: './voltage.component.html',
  styleUrls: ['./voltage.component.css']
})
export class VoltageComponent implements OnInit {
  nomMachineTextView: string;
  adresseMacTextView: string;
  facteur: string;
  databaseReference: AngularFireList<any>;
  ref: AngularFireDatabase;

  items: MenuItem[]=[];
  sizes = [1, 2, 3, 4, 5];

  ref1: any;

   chartStyles = {
    'background-color': '#87CEFA',
    'border-color': '#1E90FF',
    'color': '#000000'
  };
  
  lineChartType: keyof ChartType = 'line';
  voltageValues$: Observable<any[]>;

  public lineChartData: Array<any> = [
    { data: [], label: 'Tension' },
    { data: [], label: 'Energie consommée' }
  ];
  
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    responsive: true,
    scales: {
      xAxes: [{
        display: true
      }],
      yAxes: [{
        display: true,
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;

  currentDateAndTime: string;
  constructor(private db: AngularFireDatabase,private auth:AuthService,private router: Router,private ofAuth:AngularFireAuth) {
    this.nomMachineTextView = '';
    this.adresseMacTextView = '';
    this.databaseReference = db.list('/Machine');
    this.ref = db;

    
    //date
    this.setCurrentDateAndTime();
    //

    this.voltageValues$ = this.db.list('voltage').valueChanges();
    this.voltageValues$.subscribe(values => {
      this.lineChartData[0].data = values;
      this.lineChartLabels = Array.from(Array(values.length).keys());
    });
   }

   setCurrentDateAndTime() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    const hours = ('0' + currentDate.getHours()).slice(-2);
    const minutes = ('0' + currentDate.getMinutes()).slice(-2);
    const seconds = ('0' + currentDate.getSeconds()).slice(-2);

    this.currentDateAndTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  ngOnInit(): void {
 


    this.databaseReference.snapshotChanges().subscribe(actions => {
      actions.forEach(action => {
        const numero = action.payload.child('numero').val();
        const nomMachine = action.payload.child('nomMachine').val();
        const coefficient = action.payload.child('Coefficient').val();
    
        // Vérification de la condition
        if (numero != null && numero === 1) {
          this.nomMachineTextView = nomMachine;
          this.facteur= coefficient;
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

    this.ref1 = this.db.database.ref('Machine');
    this.ref1.on('child_added', (snapshot: { child: (arg0: string) => { (): any; new(): any; val: { (): number; new(): any; }; }; }) => {
      const numero: number | null = snapshot.child('numero').val();
      const coefficient: number | null = snapshot.child('Coefficient').val();
  
      // Vérification de la condition
      if (numero !== null && numero === 1) {
        const VOLTAGE_TO_POWER_FACTOR: number = coefficient; // Facteur de conversion de tension en puissance consommée (à ajuster en fonction des caractéristiques de votre appareil)
        const TIME_INTERVAL: number = 1; // Intervalle de temps entre chaque mesure de tension en secondes
        let totalEnergyConsumed = 0;
        this.voltageValues$.subscribe((values: number[]) => {
          this.lineChartData[0].data = values;
          this.lineChartLabels = Array.from(Array(values.length).keys());
  
          for (let i = 0; i < values.length; i++) {
            const voltageValue = values[i];
            const powerConsumed =
              voltageValue * voltageValue * VOLTAGE_TO_POWER_FACTOR * TIME_INTERVAL;
            totalEnergyConsumed += powerConsumed;
            this.lineChartData[1].data.push(totalEnergyConsumed);
          }
  
          console.log('Énergie totale consommée:', totalEnergyConsumed);
        });
      }
    });
   

    
  }
 
  

  register(){
    this.auth.logout();

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
  canActivate(): Observable<boolean> {
    return this.auth.authState.pipe(
      map((user: any) => {
        if (user) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
  
}
interface ChartType {
  line: 'line',
  bar: 'bar',
  radar: 'radar',
  // Ajouter d'autres types de graphiques si nécessaire
}

// Définir la valeur de lineChartType comme étant l'une des clés de ChartType

