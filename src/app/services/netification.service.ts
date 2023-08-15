import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NetificationService {

  constructor(private db: AngularFireDatabase) { }

  getFeuState(): Observable<boolean> {
    return this.db.object<boolean>('flamme').valueChanges().pipe(
      map((state) => state ?? false)
    );
  }
}
