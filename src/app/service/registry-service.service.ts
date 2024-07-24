import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistryServiceService {
  constructor(private firestore: AngularFirestore) {}

  addData(newData: any) {
    return this.firestore.collection('/register').add(newData);
  }

  getData(): Observable<any[]> {
    return this.firestore.collection('/register').snapshotChanges();
  }

  deleteData(id: any): Promise<void> {
    return this.firestore.doc('/register/' + id).delete();
  }

  updateMember(data: any,id:string): Promise<void> {
    {
      return this.firestore.collection('/register').doc(id).update(data);
    }
  }
}
