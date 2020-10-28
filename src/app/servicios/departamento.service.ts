import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DepartamentoI } from 'src/app/Modelos/departamento.interface';

export interface DepartamentoID extends DepartamentoI {id: string; }
@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private departamentosCollection: AngularFirestoreCollection<DepartamentoI>;
  departamentos: Observable<DepartamentoI[]>;
  public selected = {
    id: null,
    departamento: '',
    titular: '',
    correosind: '',
    teldirecto: '',
    ext: '',
    ext2: '',
    psw: ''
  };
  
  constructor(private readonly afs: AngularFirestore) {
    this.departamentosCollection = this.afs.collection<DepartamentoI>('departamentos');
    this.departamentos = this.departamentosCollection.snapshotChanges()
        .pipe(map (actions => actions.map( a => {
          const data = a.payload.doc.data() as DepartamentoI;
          const id = a.payload.doc.id;
          return {id, ...data};
        })))
    ;
  }

  getDeptos(){ return this.departamentos; }

  editDepartamento(depto: DepartamentoID){
    return this.departamentosCollection.doc(depto.id).update(depto);
  }

  addDepartamento(depto: DepartamentoI){
    return this.departamentosCollection.add(depto);
  }

  deleteDepto(id: string){

  }


}
