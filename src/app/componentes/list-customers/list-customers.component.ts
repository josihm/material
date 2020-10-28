import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerI } from 'src/app/Modelos/customer.interface';
// Importar Servicio
import { CustomerService, CustomerID } from 'src/app/servicios/customer.service';

import { MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { FormularioComponent } from 'src/app/componentes/formulario/formulario.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];

@Component({
  selector: 'app-list-customers',
  templateUrl: './list-customers.component.html',
  styleUrls: ['./list-customers.component.scss']
})

export class ListCustomersComponent implements OnInit, AfterViewInit {

  clientes: CustomerID[];
  //displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  displayedColumns: string[] = ['name', 'city', 'order', 'actions','new'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  // Inyectar Servicio
  constructor(private customerService: CustomerService,
              private matDialog: MatDialog) { }
  
  ngOnInit(): void {
    this.customerService.getCustomers().subscribe(res=> console.log("Customers ->",res));
    this.customerService.getCustomers().subscribe(res=> this.clientes);
    this.customerService.getCustomers().subscribe(res=> console.log("Clientes->",this.clientes));
    this.customerService.getCustomers().subscribe(res=> this.dataSource.data = res);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  
  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEdit(element){
    //console.log("Editar->", element);
    this.resetForm();
    this.openModal();
    if (element){
      this.customerService.selected = element;
    }
  }

  onDelete(id: string){
    //console.log("Eliminar->", id);
    this.customerService.deleteCustomer(id);
  }

  openModal(): void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: 'Modal'
    };
    dialogConfig.autoFocus = true;
    this.matDialog.open(FormularioComponent,dialogConfig);
  }

  resetForm():void{
    this.customerService.selected.name =' ';
    this.customerService.selected.city = '';
    this.customerService.selected.order = '';
    this.customerService.selected.id = null;
  }
}
