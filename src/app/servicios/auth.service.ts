import { Injectable, Query } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { DepartamentoI } from '../Modelos/departamento.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DepartamentoID } from './departamento.service';
import { query } from '@angular/animations';

type CollentionPredicate<T> = string | AngularFirestoreCollection;
type DocumentPredicate<T> = string | AngularFirestoreDocument;


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  deptoCollection: AngularFirestoreCollection<DepartamentoI>;
  private deptoDoc: AngularFirestoreDocument<DepartamentoI>;
  private depto: Observable<DepartamentoI>;

  public deptoSelected={
    id: null,
    departamento: '',
    titular: '',
    correosind: '',
    teldirecto: '',
    ext: '',
    ext2: '',
    psw: '' 
  };

  constructor(private afs: AngularFirestore) { 
    
  }

  signIn(correo:string, psw:string){
   //this.deptoCollection = this.afs.collection<DepartamentoI>("departamentos");
    return this.afs.collection("departamentos",
      ref => ref.where('departamento','==', correo)
                .where('psw', '==', psw)
    );
    /*return this.afs.collection('departamentos', ref => ref
        .where('correosind','==',correo)
        .get().then(function(querySnapShot){
          querySnapShot.forEach(function(doc){
            console.log(doc.id, "=>", doc.data());
          });
        }).catch(function(error){
          console.log("Error getting documents: ", error);
        }
    );*/
    //this.deptoCollection = this.afs.collection('departamentos', 
    //      ref => ref.where('correosind','==', correo));
    //console.log(this.deptoCollection);
    /*return this.deptoCollection
                    .where("correosind", "==", correo)
                    .get().then(function(querySnapShot){
                      querySnapShot.forEach(function(doc){
                        console.log(doc.id, "=>", doc.data());
                      });
                    }).catch(function(error){
                      console.log("Error getting documents: ", error);
                    });*/
     
 
  }

  private col<T>(ref:CollentionPredicate<T>, queryFn?): AngularFirestoreCollection{
    return typeof ref === "string"? this.afs.collection(ref,queryFn): ref;
  }

  //col$<T>(ref:CollentionPredicate<T>, queryFn?):Observable<any[]>{
  col$<T>(ref:CollentionPredicate<T>, queryFn?):Observable<any>{
    return this.col(ref,queryFn).snapshotChanges().pipe(
      map(docs => {
         return docs.map(d => {
           const data = d.payload.doc.data();
           const id = d.payload.doc.id;
           return  { id, ...data}
         })
      })
    )
  }

  getLogin(correosind:string){
    this.deptoDoc = this.afs.doc<DepartamentoI>('/departamentos/${correosind}');
    return this.depto = this.deptoDoc.snapshotChanges()
                                      .pipe(map(action=>{
                                        if (action.payload.exists === false){
                                          return null;
                                        }else{
                                          const data = action.payload.data() as DepartamentoI;
                                          data.id = action.payload.id;
                                          return data;
                                        }
                                      }));

  }

}
