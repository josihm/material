import { Component, Inject, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Departamento } from 'src/app/Modelos/departamento.class';
import { SolicitudSCPI } from 'src/app/Modelos/solicitudesscp.interface';
import { GenerarPDF } from 'src/app/servicios/generarPDF';
import { ServiciosService } from 'src/app/servicios/servicios.service';
import { ValidarFechas } from 'src/app/servicios/validarFechas';

@Component({
  selector: 'app-serviciosc',
  templateUrl: './serviciosc.component.html',
  styleUrls: ['./serviciosc.component.scss']
})

export class ServicioscComponent implements OnInit, ErrorStateMatcher {
  private unSubscribe$ = new Subject<void>();
  deptoSesion: Departamento = new Departamento();
  hoy: number = Date.now();
  extensiones: any;
  fecha: string;
  folio: number;
  ssci: SolicitudSCPI;
  ultimoRegistro_id: string;

  matcher = new ErrorStateMatcher();

  constructor(private router: Router,
              public servicios: ServiciosService,
              private dialogRef: MatDialogRef<ServicioscComponent>,
              @Inject(MAT_DIALOG_DATA) data) {  }
  
  isErrorState(control: FormControl, form: FormGroupDirective | NgForm | null): boolean {
    //throw new Error('Method not implemented.');
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  ngOnInit(): void {
    this.deptoSesion = JSON.parse(localStorage.getItem("deptoSesion"));
    this.extensiones = this.deptoSesion.ext+"  "+this.deptoSesion.ext2;
    this.fecha = new Date().toISOString().slice(0,16);
  }

  solicitarSC(){
    this.servicios.selectedSC.fechaSol = ValidarFechas.parseDateToStringWithFormat(new Date());
    this.servicios.getFolioSCP()
                  .subscribe(data =>  { this.folio = data.size+1; 
                                        console.log("verificarFolio()->"+this.folio);
                                        let newSSC = {
                                          departamento_id: "departamentos/"+this.deptoSesion.id,
                                          folio: (this.folio).toString(),
                                          destino: this.servicios.selectedSC.destino,
                                          entrega: this.servicios.selectedSC.entrega,
                                          remitente: this.servicios.selectedSC.remitente,
                                          destinatario: this.servicios.selectedSC.destinatario,
                                          formaEnvio: this.servicios.selectedSC.formaEnvio,
                                          fechaSol: this.servicios.selectedSC.fechaSol,
                                          tCorrespondencia: this.servicios.selectedSC.tCorrespondencia,
                                          tEnvio: this.servicios.selectedSC.tEnvio,
                                          infAd: this.servicios.selectedSC.infAd,
                                          cantidad: this.servicios.selectedSC.cantidad,
                                          anexo: this.servicios.selectedSC.anexo,
                                        };
                                        var sscJSON = JSON.stringify(newSSC);
                                        this.ssci = JSON.parse(sscJSON);
                                        this.registrarImprimirSC(this.ssci);
                                      }
                  );
  }

  registrarImprimirSC(ssci: SolicitudSCPI){
    var vf: ValidarFechas = new ValidarFechas(ssci.entrega,ssci.entrega,ssci.fechaSol);
    if (vf.validarFechas()){
      alert("Diferencia entre días: "+vf.getDiferencia());
      alert("Día de salida: "+ vf.getDiaDeLaSemana());
      alert("FECHAS VáLIDAS");
      
      this.servicios.addSSCP(ssci);
      
      this.servicios.col$('solicitudesst',
                          ref => ref.where('folio','==',ssci.folio))
                    .pipe(takeUntil(this.unSubscribe$))
                    .subscribe(response => { this.ultimoRegistro_id = response[0].id;
                        GenerarPDF.generaPDF_SC(this.ssci,this.deptoSesion,Number(ssci.folio),this.ultimoRegistro_id);
                    });
      
      this.limpiarFormulario();
      this.ngOnInit();
      this.router.navigate(['solicitudessc']);
      //-----PODRA REGISTRARSE SIN folio Y DESPUéS ACTUALIZAR mediante update Y DESPUéS IMPRIMIR
    }else{
      console.log("Diferencia entre días: "+vf.getDiferencia());
      console.log("Día de salida: "+ vf.getDiaDeLaSemana());
      console.log("FECHAS NO VALIDADAS");
    }
  }
  
  guardar(){
    if (this.servicios.selectedSC.id == null
      || this.servicios.selectedSC.id == ''){
        this.solicitarSC();
    }else{
      //FALLA al parsear con las fechas de inicio de mes PENSAR y CORREGIR el error
      this.servicios.selectedSC.entrega = ValidarFechas.fechaToString(new Date(Date.parse(this.servicios.selectedSC.entrega)));
      this.servicios.editSSC(this.servicios.selectedSC);
    }
    this.close();
  }
  
  close(): void{
    this.dialogRef.close();
  }

  limpiarFormulario(){
    this.servicios.selectedSC.departamento_id = '';
    this.servicios.selectedSC.folio = '';
    this.servicios.selectedSC.remitente = '';
    this.servicios.selectedSC.destinatario = '';
    this.servicios.selectedSC.destino = '';
    this.servicios.selectedSC.entrega = '';
    this.servicios.selectedSC.cantidad = '';
    this.servicios.selectedSC.fechaSol = '';
    this.servicios.selectedSC.tCorrespondencia = '';
    this.servicios.selectedSC.formaEnvio = '';
    this.servicios.selectedSC.tEnvio = '';
    this.servicios.selectedSC.infAd = '';
    this.servicios.selectedSC.anexo = '';
  }
}
