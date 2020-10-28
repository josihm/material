import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog';

import { DepartamentoI } from 'src/app/Modelos/departamento.interface';
import { DepartamentoService } from 'src/app/servicios/departamento.service';
import { DepartamentoComponent } from '../departamento/departamento.component';

@Component({
  selector: 'app-lista-departamentos',
  templateUrl: './lista-departamentos.component.html',
  styleUrls: ['./lista-departamentos.component.scss']
})
export class ListaDepartamentosComponent implements OnInit {

  displayedColumns: string[] = ['departamento', 
                                'titular', 
                                'e-mail', 
                                'teléfono(s)',
                                'extension(es)',
                                'acciones',
                                'new'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;

  constructor(private deptoService: DepartamentoService,
              private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.deptoService.getDeptos().subscribe(data => this.dataSource.data = data);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEdit(element){
    this.limpiarFormulario();
    this.openModal();
    if (element){
      this.deptoService.selected = element;
    }
    this.ngOnInit();
  }

  onDelete(id: string){
    this.deptoService.deleteDepto(id);
  }

  openModal(): void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: 'Modal'
    };
    dialogConfig.autoFocus = true;
    this.matDialog.open(DepartamentoComponent,dialogConfig);
  }

  limpiarFormulario(){
    this.deptoService.selected.departamento = '';
    this.deptoService.selected.titular = '';
    this.deptoService.selected.correosind = '';
    this.deptoService.selected.teldirecto = '';
    this.deptoService.selected.ext = '';
    this.deptoService.selected.ext2 = '';
    this.deptoService.selected.psw = '';
  }
}
