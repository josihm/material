import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Departamento } from 'src/app/Modelos/departamento.class';
import { Horas } from 'src/app/Modelos/horas.class';
import { SolicitudST } from 'src/app/Modelos/solicitud-st';
import { SolicitudSTI } from 'src/app/Modelos/solicitudesst.interface';
import { GenerarPDF } from 'src/app/servicios/generarPDF';
import { ServiciosService } from 'src/app/servicios/servicios.service';
import { ValidarFechas } from 'src/app/servicios/validarFechas';

@Component({
  selector: 'app-serviciost',
  templateUrl: './serviciost.component.html',
  styleUrls: ['./serviciost.component.scss']
})
export class ServiciostComponent implements OnInit {
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
  ns: number;

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
              public servicios: ServiciosService,
              private dialogRef: MatDialogRef<ServiciostComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              @Inject(MAT_DIALOG_SCROLL_STRATEGY) scrollS) { 
  }

  ngOnInit(): void {
    this.deptoSesion = JSON.parse(localStorage.getItem("deptoSesion"));
    this.extensiones = this.deptoSesion.ext+"  "+this.deptoSesion.ext2;
    this.fecha = new Date().toISOString().slice(0,16);
  }

  solicitarST(){
    this.servicios.selectedST.fechaSol = ValidarFechas.parseDateToStringWithFormat(new Date());
    var salst = Date.parse(this.servicios.selectedST.salidaSt);
    this.servicios.selectedST.salidaSt = ValidarFechas.fechaToString(new Date(salst));
    this.servicios.selectedST.regresoSt = ValidarFechas.fechaToString(new Date(this.servicios.selectedST.regresoSt));
    console.log('---------FUNCION solicitarST()---------');
    console.log('salidaSt: ',this.servicios.selectedST.salidaSt);
    console.log('regresoSt: ',this.servicios.selectedST.salidaSt);
    console.log('--------- EMPIEZA getFoliST() de solicitarST()---------');

    this.servicios.getFolioST()
                  .subscribe(data =>  { this.folio = data.size+1; 
                                        console.log("verificarFolio()->"+this.folio);
                                        let newSST = {
                                          departamento_id: "departamentos/"+this.deptoSesion.id,
                                          folio: (this.folio).toString(),
                                          destino: this.servicios.selectedST.destino,
                                          salidaSt: this.servicios.selectedST.salidaSt,
                                          regresoSt: this.servicios.selectedST.regresoSt,
                                          horaS: this.servicios.selectedST.horaS,
                                          horaR: this.servicios.selectedST.horaR,
                                          fechaSol: this.servicios.selectedST.fechaSol,
                                          tServicio: this.servicios.selectedST.tServicio,
                                          tTransporte: this.servicios.selectedST.tTransporte,
                                          infAd: this.servicios.selectedST.infAd,
                                          nPasajeros: this.servicios.selectedST.nPasajeros,
                                          pasajeros: this.servicios.selectedST.pasajeros,
                                        };
                                        var sstJSON = JSON.stringify(newSST);
                                        this.ssti = JSON.parse(sstJSON);
                                        //this.registrarImprimirST(this.ssti);
                                        this.verificarDisponibilidadyFechas(this.ssti);
                                      }
                  );
  }

  registrarImprimirST(ssti:SolicitudSTI){
    this.servicios.addSST(ssti);
    this.servicios.col$('solicitudesst',
                        ref => ref.where('folio','==',ssti.folio))
                                  .pipe(takeUntil(this.unSubscribe$))
                                  .subscribe(response => { 
                                    this.ultimoRegistro_id = response[0].id;
                                    GenerarPDF.generaPDF_ST(this.ssti,this.deptoSesion,Number(ssti.folio),this.ultimoRegistro_id);
                    });
      this.limpiarFormulario();
      this.ngOnInit();
      this.router.navigate(['solicitudesst']);
  }

  registrarImprimirSTANTERIOR(ssti:SolicitudSTI){
    var vf: ValidarFechas = new ValidarFechas(ssti.salidaSt,ssti.regresoSt,ssti.fechaSol);
    
    /*var salst = Date.parse(ssti.salidaSt);
    var salstDate = new Date(salst);
    var salidast = ValidarFechas.fechaToString(salstDate);
    ssti.salidaSt = salidast;

    var regst = Date.parse(ssti.regresoSt);
    var regstDate = new Date(regst);
    var regresost = ValidarFechas.fechaToString(regstDate);
    ssti.regresoSt = regresost;*/

    if (vf.validarFechas()){
      //alert("Diferencia entre días: "+vf.getDiferencia());
      //alert("Día de salida: "+ vf.getDiaDeLaSemana());
      alert("FECHAS VáLIDAS");
      
      //PROGRAMAR LA VERIFICACION DE DISPONIBILIDAD
      this.servicios.addSST(ssti);
      
      this.servicios.col$('solicitudesst',
                          ref => ref.where('folio','==',ssti.folio))
                    .pipe(takeUntil(this.unSubscribe$))
                    .subscribe(response => { this.ultimoRegistro_id = response[0].id;
                        GenerarPDF.generaPDF_ST(this.ssti,this.deptoSesion,Number(ssti.folio),this.ultimoRegistro_id);
                    });
      
      this.limpiarFormulario();
      this.ngOnInit();
      this.router.navigate(['solicitudesst']);
      //-----PODRA REGISTRARSE SIN folio Y DESPUéS ACTUALIZAR mediante update Y DESPUéS IMPRIMIR
    }else{
      console.log("Diferencia entre días: "+vf.getDiferencia());
      console.log("Día de salida: "+ vf.getDiaDeLaSemana());
      console.log("FECHAS NO VALIDADAS");
    }
  }

  limpiarFormulario(){
    this.servicios.selectedST.departamento_id = '';
    this.servicios.selectedST.folio = '';
    this.servicios.selectedST.destino = '';
    this.servicios.selectedST.salidaSt = '';
    this.servicios.selectedST.regresoSt = '';
    this.servicios.selectedST.horaS = '';
    this.servicios.selectedST.horaR = '';
    this.servicios.selectedST.fechaSol = '';
    this.servicios.selectedST.tServicio = '';
    this.servicios.selectedST.tTransporte = '';
    this.servicios.selectedST.infAd = '';
    this.servicios.selectedST.pasajeros = '';
    this.servicios.selectedST.nPasajeros = '';
  }

  guardar(){
    if (this.servicios.selectedST.id == null
      || this.servicios.selectedST.id == ''){
        this.solicitarST();
    }else{
      this.servicios.selectedST.salidaSt = ValidarFechas.fechaToString(new Date(Date.parse(this.servicios.selectedST.salidaSt)));
      this.servicios.selectedST.regresoSt = ValidarFechas.fechaToString(new Date(Date.parse(this.servicios.selectedST.regresoSt)));
      this.servicios.editSST(this.servicios.selectedST);
    }
    this.close();
  }
  
  close(): void{
    this.dialogRef.close();
  }

  verificarDisponibilidad(ssti:SolicitudSTI){}

  //Función que verifica la disponibilidad de transporte y verifica que las fechas sean válidas,
  // Hay que mejorar el codigo de la clase ValidarFechas
  verificarDisponibilidadyFechas(ssti:SolicitudSTI){
    var vf: ValidarFechas = new ValidarFechas(ssti.salidaSt,ssti.regresoSt,ssti.fechaSol);
    if (vf.validarFechas()){
      alert("FECHAS VáLIDAS");
      //La siguiente línea verifica la disponibilidad **HAY QUE MEJORAR el CÓDIGO
      //this.servicios.disponibilidad(ssti);
      
      this.servicios.col$('solicitudesst',
                        ref => ref.where('salidaSt','==',ssti.salidaSt)
                                  .where('horaS', '==', ssti.horaS))
                                  .pipe(takeUntil(this.unSubscribe$))
                                  .subscribe(querySnapshot => {
                                    this.ns = querySnapshot.length;
                                    console.log('contador',this.ns);
                                    if (this.ns > 2) { 
                                      console.log('finaliza');
                                      alert('No hay disponibilidad de transportes en esa fecha y horario, comuníquese con el Departamento de Jardinería y Transportes');
                                    }else {
                                      console.log('subscribe ', this.ns);
                                      this.registrarImprimirST(ssti);
                                      takeUntil(this.unSubscribe$);
                                    }
                                  });
    
    }else{
      console.log("Diferencia entre días: "+vf.getDiferencia());
      console.log("Día de salida: "+ vf.getDiaDeLaSemana());
      console.log("FECHAS NO VALIDADAS");
    }
  }


}