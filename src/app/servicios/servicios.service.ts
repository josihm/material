import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Departamento } from '../Modelos/departamento.class';
import { SolicitudST } from '../Modelos/solicitud-st';
import { SolicitudSTI } from 'src/app/Modelos/solicitudesst.interface';
import { stringify } from '@angular/compiler/src/util';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { SolicitudSCPI } from '../Modelos/solicitudesscp.interface';
import { SolicitudSCP } from '../Modelos/solicitud-sc';
import { HttpClient } from '@angular/common/http';

export interface SolicitudSTID extends SolicitudSTI { id: string; }
export interface SolicitudSCPID extends SolicitudSCPI { id: string; }
type CollentionPredicate<T> = string | AngularFirestoreCollection;
type DocumentPredicate<T> = string | AngularFirestoreDocument;

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private unSubscribe$ = new Subject<void>();

  private sstColeccion: AngularFirestoreCollection<SolicitudSTI>;
  private sscColeccion: AngularFirestoreCollection<SolicitudSCPI>;
  private hstColeccion: AngularFirestoreCollection<any>;

  ssts: Observable<SolicitudSTI[]>;
  sscs: Observable<SolicitudSCPI[]>;

  public folio: string;
  public ids: string;

  public selectedST = {
    id: null,
    folio: '',
    departamento_id: '',
    destino: '',
    salidaSt: '',
    regresoSt: '',
    horaS: '',
    horaR: '',
    fechaSol: '',
    tServicio: '',
    tTransporte: '',
    infAd: '',
    nPasajeros: '',
    pasajeros: '',
  };

  public selectedSC = {
    id: null,
    folio: '',
    departamento_id: '',
    remitente: '',
    destinatario: '',
    destino: '',
    entrega: '',
    tCorrespondencia: '',
    tEnvio: '',
    formaEnvio: '',
    cantidad: '',
    fechaSol: '',
    infAd: '',
    anexo: null,
  }
  constructor(private readonly afs: AngularFirestore,
              private _http: HttpClient) {
    
    this.sstColeccion = this.afs.collection<SolicitudSTI>('solicitudesst');
    this.sscColeccion = this.afs.collection<SolicitudSCPI>('solicitudessc');
    
    this.ssts = this.sstColeccion.snapshotChanges()
        .pipe(map (actions => actions.map( a => {
          const data = a.payload.doc.data() as SolicitudSTI;
          const id = a.payload.doc.id;
          return {id, ...data};
        })))
    ;
    this.sscs = this.sscColeccion.snapshotChanges()
        .pipe(map (actions => actions.map( a => {
          const data = a.payload.doc.data() as SolicitudSCPI;
          const id = a.payload.doc.id;
          return {id, ...data};
        })))
    ;
    //this.folio = this.sstColeccion.get.length.toString();
    //this.folio = this.sstColeccion.get.length.toString();
  }

  allSST(){
    return this.ssts;
  }
  allSSCP(){
    return this.sscs;
  }

  getFolioST(){
    return this.sstColeccion.get();
  }

  getFolioSCP(){
    return this.sscColeccion.get();
  }

  getEditST(sscpid: SolicitudSCPID){
    return this.sscColeccion.doc(sscpid.id).get();
  }

  getEditSC(sstid: SolicitudSTID){
    return this.sstColeccion.doc(sstid.id).get();
  }

  sstsDepto(idDepto:string){
    this.sstColeccion.ref.where('departamento_id','==',idDepto);

    this.sstColeccion.ref.where('departamento_id','==',idDepto).onSnapshot;
    
    //let respuesta = this.sstColeccion.snapshotChanges().pipe();

    let respuesta = this.sstColeccion
                          .ref.where('departamento_id','==',idDepto)
                          .get()
                          .then(function(querySnapshot){
                              //this.folio = querySnapshot.size.toString();
                              querySnapshot.forEach(function(doc){
                                console.log(doc.id,"=>", doc.data());
                              })
                          })
                          .catch(function(error){
                                  console.log('ERRRRRoRRRRR: ', error);
                          });

    /*console.log('----->',this.sstColeccion
            .ref.where('departamento_id','==',idDepto)
            .get()
            .then(function(querySnapshot){
              querySnapshot.forEach(function(doc){
                console.log(doc.id,"=>", doc.data());
              })
            })
            .catch(function(error){
                console.log('ERRRRRoRRRRR: ', error);
              })
    );*/
    //let size = this.sstColeccion.get().subscribe(function(querySnapshot){this.folio = querySnapshot.size; console.log("->>>"+querySnapshot.size);});
    //console.log('XXXXXXXXX', [this.folio]);
    return respuesta;
  }

  //addSST(sst: SolicitudSTI){
  addSST(sst: SolicitudSTI){
    this.sstColeccion.add(sst);
  }

  addSSCP(ssc: SolicitudSCPI){
    this.sscColeccion.add(ssc);
  }
  
  editSST(sst: SolicitudSTID){
    return this.sstColeccion.doc(sst.id).update(sst);
  }

  editSSC(ssc: SolicitudSCPID){
    return this.sscColeccion.doc(ssc.id).update(ssc);
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

  disponibilidad(ssti: SolicitudSTI){
    this.sstColeccion.ref.where('salidaSt','==',ssti.salidaSt)
                        .where('horaS', '==', ssti.horaS)
                        .get()
                        .then(function(querySnapshot){
                              //this.folio = querySnapshot.size.toString();
                              console.log('disponibilidad', querySnapshot.size);
                              querySnapshot.forEach(function(doc){
                                console.log(doc.id,"=>", doc.data());
                              })
                          })
                          .catch(function(error){
                                  console.log('ERRRRRoRRRRR: ', error);
                          });
  }

  mandarCorreo(body){
    console.log("cuerpo: ", body);
    return this._http.post('http://localhost:3000/formulario', body);
  }
}
