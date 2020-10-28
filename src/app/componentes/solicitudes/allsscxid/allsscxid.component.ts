import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Departamento } from 'src/app/Modelos/departamento.class';
import { GenerarPDF } from 'src/app/servicios/generarPDF';
import { GenerarPDFsc } from 'src/app/servicios/generarPDFsc';
import { ServiciosService } from 'src/app/servicios/servicios.service';
import { TokenService } from 'src/app/servicios/token.service';
import { ValidarFechas } from 'src/app/servicios/validarFechas';
import { ServicioscComponent } from '../serviciosc/serviciosc.component';

@Component({
  selector: 'app-allsscxid',
  templateUrl: './allsscxid.component.html',
  styleUrls: ['./allsscxid.component.scss']
})
export class AllsscxidComponent implements OnInit {

  isLogged = false;
  isLoginFail = false;
  roles: string[]=[];
  errorMsg = '';

  depto: Departamento = new Departamento();
  private unSubscribe$ = new Subject<void>();

  displayedColumns: string[] = ['folio',
                                'fechaSol',
                                'remitente', 
                                'destino', 
                                'destinatario', 
                                'entrega',
                                'tCorrespondencia',
                                'tEnvio',
                                'acciones',
                                'new',
                              ];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;

  constructor(private servicios: ServiciosService,
              private matDialog: MatDialog, 
              private overlay: Overlay,
              private tokenServicio:TokenService,
              private router: Router) { }

  ngOnInit(): void {
    if (this.tokenServicio.getToken()) {
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenServicio.getAuthorities();

      this.depto = JSON.parse(localStorage.getItem("deptoSesion"));
      if (this.depto.departamento=="JARDINERÍA Y TRANSPORTES"){
        this.servicios.allSSCP().subscribe(data => this.dataSource.data = data);
      }else{
        this.servicios.col$(
                            'solicitudessc',
                              ref => ref.where('departamento_id','==','departamentos/'+this.depto.id))
                      .pipe(takeUntil(this.unSubscribe$))
                      .subscribe(response => { 
                        this.dataSource.data = response;
                      });
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
    this.matDialog.open(ServicioscComponent,dialogConfig);
  }

  onEdit(element){
    this.limpiarFormulario();
    this.openModal();
    if (element){
      this.servicios.selectedSC = element;
      console.log('element.entrega',element.entrega);
      this.servicios.selectedSC.entrega = ValidarFechas.convertirFechaToMatPicker(element.entrega);
      console.log(this.servicios.selectedSC.entrega);
    }
    this.ngOnInit();
  }

  imprimir(element){
    GenerarPDF.generaPDF_SC(element,this.depto,Number(element.folio),element.id);
  }

  limpiarFormulario(){
    this.servicios.selectedSC.departamento_id = '';
    this.servicios.selectedSC.destino = '';
    this.servicios.selectedSC.folio = '';
    this.servicios.selectedSC.fechaSol = '';
    this.servicios.selectedSC.destinatario = '';
    this.servicios.selectedSC.remitente = '';
    this.servicios.selectedSC.entrega = '';
    this.servicios.selectedSC.cantidad = '';
    this.servicios.selectedSC.tCorrespondencia = '';
    this.servicios.selectedSC.tEnvio = '';
    this.servicios.selectedSC.infAd = '';
    this.servicios.selectedSC.formaEnvio = '';
    this.servicios.selectedSC.anexo = '';
  }
}
