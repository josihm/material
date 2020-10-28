import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Departamento } from 'src/app/Modelos/departamento.class';
import { Horas } from 'src/app/Modelos/horas.class';
import { SolicitudST } from'src/app/Modelos/solicitud-st';

import { GenerarPDF } from 'src/app/servicios/generarPDF';
import { ServiciosService } from 'src/app/servicios/servicios.service';
import { ValidarFechas } from 'src/app/servicios/validarFechas';

import { SolicitudSTI } from 'src/app/Modelos/solicitudesst.interface';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sst',
  templateUrl: './sst.component.html',
  styleUrls: ['./sst.component.scss']
})
export class SstComponent implements OnInit {
  private unSubscribe$ = new Subject<void>();

  MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
  fecha: string;
  diferencia: number;
  diadelasemana: string;
  idtt: number;
  idtst:number;
  npas:number;
  folio: number;
  color: string;

  deptoSesion: Departamento = new Departamento();
  extensiones: any;
  hoy: number = Date.now();
  sst: SolicitudST = new SolicitudST();
  ssti: SolicitudSTI;
  ultimasst: SolicitudST = new SolicitudST();

  ultimoRegistro_id: string;
  
  horas: Horas[]=[
    { value: '07:00', viewValue: '07:00'},
    { value: '07:15', viewValue: '07:15'},
    { value: '07:30', viewValue: '07:30'},
    { value: '07:45', viewValue: '07:45'},
    { value: '08:00', viewValue: '08:00'},
    { value: '08:15', viewValue: '08:15'},
    { value: '08:30', viewValue: '08:30'},
    { value: '08:45', viewValue: '08:45'},
    { value: '09:00', viewValue: '09:00'},
    { value: '09:15', viewValue: '09:15'},
    { value: '09:30', viewValue: '09:30'},
    { value: '09:45', viewValue: '09:45'},
    { value: '10:00', viewValue: '10:00'},
    { value: '10:15', viewValue: '10:15'},
    { value: '10:30', viewValue: '10:30'},
    { value: '10:45', viewValue: '10:45'},
    { value: '11:00', viewValue: '11:00'},
    { value: '11:15', viewValue: '11:15'},
    { value: '11:30', viewValue: '11:30'},
    { value: '11:45', viewValue: '11:45'},
    { value: '12:00', viewValue: '12:00'},
    { value: '12:15', viewValue: '12:15'},
    { value: '12:30', viewValue: '12:30'},
    { value: '12:45', viewValue: '12:45'},
    { value: '13:00', viewValue: '13:00'},
    { value: '13:15', viewValue: '13:15'},
    { value: '13:30', viewValue: '13:30'},
    { value: '13:45', viewValue: '13:45'},
    { value: '14:00', viewValue: '14:00'},
    { value: '14:15', viewValue: '14:15'},
    { value: '14:30', viewValue: '14:30'},
    { value: '14:45', viewValue: '14:45'},
    { value: '15:00', viewValue: '15:00'},
    { value: '15:15', viewValue: '15:15'},
    { value: '15:30', viewValue: '15:30'},
    { value: '15:45', viewValue: '15:45'},
    { value: '16:00', viewValue: '16:00'},
    { value: '16:15', viewValue: '16:15'},
    { value: '16:30', viewValue: '16:30'},
    { value: '16:45', viewValue: '16:45'},
    { value: '17:00', viewValue: '17:00'},
    { value: '17:15', viewValue: '17:15'},
    { value: '17:30', viewValue: '17:30'},
    { value: '17:45', viewValue: '17:45'},
    { value: '18:00', viewValue: '18:00'},
    { value: '18:15', viewValue: '18:15'},
    { value: '18:30', viewValue: '18:30'},
    { value: '18:45', viewValue: '18:45'},
    { value: '19:00', viewValue: '19:00'},
    { value: '19:15', viewValue: '19:15'},
    { value: '19:30', viewValue: '19:30'},
    { value: '19:45', viewValue: '19:45'},
    { value: '20:00', viewValue: '20:00'},
    { value: '20:15', viewValue: '20:15'},
    { value: '20:30', viewValue: '20:30'},
    { value: '20:45', viewValue: '20:45'},
    { value: '21:00', viewValue: '21:00'},
    { value: '21:15', viewValue: '21:15'},
    { value: '21:30', viewValue: '21:30'},
    { value: '21:45', viewValue: '21:45'},
  ]

  constructor(private router: Router,
              public servicios: ServiciosService) { 
  }

  ngOnInit(): void {
    this.deptoSesion = JSON.parse(localStorage.getItem("deptoSesion"));
    this.extensiones = this.deptoSesion.ext+"  "+this.deptoSesion.ext2;
    this.fecha = new Date().toISOString().slice(0,16);
    this.servicios.getFolio().subscribe(data => {this.folio = data.size+1; console.log(this.folio)});
  }

  verificarFolio(){
    this.servicios.selected.fechaSol = ValidarFechas.parseDateToStringWithFormat(new Date());
    this.servicios.getFolio()
                  .subscribe(data =>  { this.folio = data.size+1; 
                                        //console.log(this.folio);
                                        let newSST = {
                                          departamento_id: "departamentos/"+this.deptoSesion.id,
                                          folio: (this.folio).toString(),
                                          destino: this.servicios.selected.destino,
                                          salidaSt: this.servicios.selected.salidaSt,
                                          regresoSt: this.servicios.selected.regresoSt,
                                          horaS: this.servicios.selected.horaS,
                                          horaR: this.servicios.selected.horaR,
                                          fechaSol: this.servicios.selected.fechaSol,
                                          tServicio: this.servicios.selected.tServicio,
                                          tTransporte: this.servicios.selected.tTransporte,
                                          infAd: this.servicios.selected.infAd,
                                          nPasajeros: this.servicios.selected.nPasajeros,
                                          pasajeros: this.servicios.selected.pasajeros,
                                        };
                                        var sstJSON = JSON.stringify(newSST);
                                        this.ssti = JSON.parse(sstJSON);
                                        this.solicitarST(this.ssti);
                                      }
                  );
  }

  solicitarST(ssti:SolicitudSTI){
    //this.servicios.selected.fechaSol = ValidarFechas.parseDateToStringWithFormat(new Date());
/*****************
    let newSST = {
      departamento_id: "departamentos/"+this.deptoSesion.id,
      folio: (this.folio).toString(),
      destino: this.servicios.selected.destino,
      salidaSt: this.servicios.selected.salidaSt,
      regresoSt: this.servicios.selected.regresoSt,
      horaS: this.servicios.selected.horaS,
      horaR: this.servicios.selected.horaR,
      fechaSol: this.servicios.selected.fechaSol,
      tServicio: this.servicios.selected.tServicio,
      tTransporte: this.servicios.selected.tTransporte,
      infAd: this.servicios.selected.infAd,
      nPasajeros: this.servicios.selected.nPasajeros,
      pasajeros: this.servicios.selected.pasajeros,
    };
********************/
    //console.log('folio-->: ',this.folio);
    //console.log(newSST);

    //var vf: ValidarFechas = new ValidarFechas(newSST.salidaSt,newSST.regresoSt,newSST.fechaSol);
    var vf: ValidarFechas = new ValidarFechas(ssti.salidaSt,ssti.regresoSt,ssti.fechaSol);

    if (vf.validarFechas()){
      console.log("Diferencia entre días: "+vf.getDiferencia());
      console.log("Día de salida: "+ vf.getDiaDeLaSemana());
      console.log("FECHAS VáLIDAS");
      
      //var sstJSON = JSON.stringify(newSST);
      //this.sst = JSON.parse(sstJSON);
      
      //this.servicios.addSST(newSST);
      this.servicios.addSST(ssti);
      //this.ngOnInit();
      //this.servicios.(String(this.folio).toString()).subscribe(data => {this.ultimoRegistro_id = data.id; console.log(this.ultimoRegistro_id); } );
      this.servicios.col$('solicitudesst',
                          ref => ref.where('folio','==',ssti.folio))
                    .pipe(takeUntil(this.unSubscribe$))
                    .subscribe(response => { this.ultimoRegistro_id = response[0].id;
                        console.log('col$:', response);
                        console.log('id-->:', response[0].id);
                        console.log('this.ultimoRegistro_id-->:', this.ultimoRegistro_id);
                        GenerarPDF.generaPDF_ST(this.ssti,this.deptoSesion,Number(ssti.folio),this.ultimoRegistro_id);
                    });
      //-----PODRA REGISTRARSE SIN folio Y DESPUéS ACTUALIZAR mediante update Y DESPUéS IMPRIMIR
      
      //GenerarPDF.generaPDF_ST(this.sst,this.deptoSesion,Number(newSST.folio),this.ultimoRegistro_id);
      //GenerarPDF.generaPDF_ST(this.sst,this.deptoSesion,Number(newSST.folio));
    }else{
      console.log("Diferencia entre días: "+vf.getDiferencia());
      console.log("Día de salida: "+ vf.getDiaDeLaSemana());
      console.log("FECHAS NO VALIDADAS");
    }

    
    //this.limpiarFormulario();
    //this.ngOnInit();
    console.log('Fuera del IF. this.ultimoRegistro_id-->>',this.ultimoRegistro_id);
  }

  limpiarFormulario(){
    this.servicios.selected.departamento_id = '';
    this.servicios.selected.folio = '';
    this.servicios.selected.destino = '';
    this.servicios.selected.salidaSt = '';
    this.servicios.selected.regresoSt = '';
    this.servicios.selected.horaS = '';
    this.servicios.selected.horaR = '';
    this.servicios.selected.fechaSol = '';
    this.servicios.selected.tServicio = '';
    this.servicios.selected.tTransporte = '';
    this.servicios.selected.infAd = '';
    this.servicios.selected.pasajeros = '';
    this.servicios.selected.nPasajeros = '';
  }

  async getAsyncData(){
    
  }

  async getIDSST(id:string){
    //this.ultimasst = await this.servicios.getIdsst(id).toPromise();
    
    await this.servicios.col$(
                        'solicitudesst',
                        ref => ref.where('folio','==',id))
                  .pipe(takeUntil(this.unSubscribe$))
                  .subscribe(response => { this.ultimoRegistro_id = response.id;
                  console.log('RESPONSE', response);});

    //return await this.servicios.getIdsst(String(this.folio).toString()).subscribe(data => {this.ultimoRegistro_id = data.id; console.log(this.ultimoRegistro_id); } );
  }
}
