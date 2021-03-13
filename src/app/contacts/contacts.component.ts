import { Component, OnInit } from '@angular/core';
import { AllCommunityModules, GridApi, Module } from '@ag-grid-community/all-modules';
import { ContactService } from '../service/contact.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  rowData: any;
  totalRows: any;
  rowSelection: string;

  constructor(public _contactService: ContactService) { 
    this.rowSelection='single';
  }

  contactsColumnDefs = [
    { headerName: 'Name', field: 'name', filter: true, sortable: true, resizable: true },
    { headerName: 'Job Title', field: 'jobTitle', filter: true, sortable: true, resizable: true },
    { headerName: 'Company', field: 'company', filter: true, sortable: true, resizable: true },
    { headerName: 'Phone', field: 'phone', filter: true, sortable: true, resizable: true },
    { headerName: 'Address', field: 'address', filter: true, sortable: true, resizable: true },
    { headerName: 'Email', field: 'email', filter: true, sortable: true, resizable: true },
    { headerName: 'Last Contacted Date', field: 'lastDateContacted', filter: true, sortable: true, resizable: true }
  ];

  // Pagination config starts
  public paginationPageSize = 20;
  private gridApi: GridApi;
  private gridColumnApi;

  //On grid ready function
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }
  
  ngOnInit(): void {
    this.getContacts();
  }

  //to get all contacts
  getContacts(){    
    this._contactService.getContacts().subscribe(
      data => this.rowData = data, 
      error => console.log('Error', error),      
    );
  }

  //On select of each row. Function called from accounting-period.component.html in (selectionChanged) ag grid
  showContactDetails(message: string) {
    var selectedRow = this.gridApi.getSelectedRows();
    console.log(selectedRow);
  }
}