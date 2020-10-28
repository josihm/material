import { Component, OnInit, AfterViewInit, ViewChild, InjectionToken  } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog';
//SERVICIOS
import { ServiciosService } from 'src/app/servicios/servicios.service';
import { SscComponent } from '../ssc/ssc.component';
import { Departamento } from 'src/app/Modelos/departamento.class';
import { Subject } from 'rxjs';

import { map, takeUntil } from 'rxjs/operators';
import { SstComponent } from '../sst/sst.component';
import { ServiciostComponent } from 'src/app/componentes/solicitudes/serviciost/serviciost.component';
import { Overlay, ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { GenerarPDF } from 'src/app/servicios/generarPDF';
import { TokenService } from 'src/app/servicios/token.service';
import { Router } from '@angular/router';
import { ValidarFechas } from 'src/app/servicios/validarFechas';

@Component({
  selector: 'app-allsstxid',
  templateUrl: './allsstxid.component.html',
  styleUrls: ['./allsstxid.component.scss']
})
export class AllsstxidComponent implements OnInit {

  isLogged = false;
  isLoginFail = false;
  roles: string[]=[];
  errorMsg = '';

  depto: Departamento = new Departamento();
  private unSubscribe$ = new Subject<void>();

  displayedColumns: string[] = ['folio',
                                'fechaSol',
                                'departamento_id', 
                                'destino', 
                                'salidaSt', 
                                'regresoSt',
                                'tServicio',
                                'tTransporte',
                                'acciones',
                                'new',
                              ];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(private servicios: ServiciosService,
              private matDialog: MatDialog,  private overlay: Overlay,
              private tokenServicio: TokenService,
              private router: Router) { }
  
  ngOnInit(): void {
    if (this.tokenServicio.getToken()) {
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenServicio.getAuthorities();

      this.depto = JSON.parse(localStorage.getItem("deptoSesion"));
      this.depto = JSON.parse(localStorage.getItem("deptoSesion"));
      if (this.depto.departamento=="JARDINERÍA Y TRANSPORTES"){
        this.servicios.allSST().subscribe(data => this.dataSource.data = data);
      }else{
        this.servicios.col$(
                            'solicitudesst',
                              ref => ref.where('departamento_id','==','departamentos/'+this.depto.id))
                      .pipe(takeUntil(this.unSubscribe$))
                      .subscribe(response => { 
                        this.dataSource.data = response;
                        console.log('RESPONSE', response);
                      });
        //this.servicios.sstsDepto(this.depto.id).then(data => this.dataSource.data).catch(function(error){console.log(error);});
        //this.servicios.sstsDepto1().subscribe(data=>this.dataSource.data = data);
      }
    }else{
      this.router.navigate(['home']);
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openModal(): void{
    const dialogConfig = new MatDialogConfig();
    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    dialogConfig.data = {
      title: 'Modal',
    };
    dialogConfig.autoFocus = true;
    dialogConfig.scrollStrategy;
    dialogConfig.maxHeight = '480px';
    this.matDialog.open(ServiciostComponent,dialogConfig);
  }

  limpiarFormulario(){
    this.servicios.selectedST.departamento_id = '';
    this.servicios.selectedST.destino = '';
    this.servicios.selectedST.folio = '';
    this.servicios.selectedST.fechaSol = '';
    this.servicios.selectedST.salidaSt = '';
    this.servicios.selectedST.regresoSt = '';
    this.servicios.selectedST.horaS = '';
    this.servicios.selectedST.horaR = '';
    this.servicios.selectedST.tServicio = '';
    this.servicios.selectedST.tTransporte = '';
    this.servicios.selectedST.infAd = '';
    this.servicios.selectedST.nPasajeros = '';
    this.servicios.selectedST.pasajeros = '';
  }
  
  onEdit(element){
    this.limpiarFormulario();
    this.openModal();
    if (element){
      this.servicios.selectedST = element;
      console.log('element.salidaSt',element.salidaSt);
      console.log('element.regresoSt',element.regresoSt);
      this.servicios.selectedST.salidaSt = ValidarFechas.convertirFechaToMatPicker(element.salidaSt);
      this.servicios.selectedST.regresoSt = ValidarFechas.convertirFechaToMatPicker(element.regresoSt);
      console.log(this.servicios.selectedST.salidaSt);
    }
    this.ngOnInit();
  }

  onDelete(){}

  imprimir(element){
    GenerarPDF.generaPDF_ST(element,this.depto,Number(element.folio),element.id);
  }

}
