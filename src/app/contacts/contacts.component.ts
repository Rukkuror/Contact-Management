import { Component, OnInit } from '@angular/core';
import { AllCommunityModules, GridApi, Module } from '@ag-grid-community/all-modules';
import { ContactService } from '../service/contact.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
 
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  rowData: any;
  totalRows: any;
  rowSelection: string;

  constructor(public _contactService: ContactService, private router: Router, private toastr: ToastrService) { 
    this.rowSelection='single';
  }

  contactsColumnDefs = [
    { headerName: "Name (Job Title)", field: 'name', filter: true, sortable: true, resizable: true, autoHeight: true,
      cellRenderer: function(param){
        return param.data.name+ '<br/>'+ param.data.jobTitle;
      }
    },    
    { headerName: 'Company', field: 'company', filter: true, sortable: true, resizable: true },
    { headerName: 'Phone', field: 'phone', filter: true, sortable: true, resizable: true },
    { headerName: 'Address', field: 'address', filter: true, sortable: true, resizable: true },
    { headerName: 'Email', field: 'email', filter: true, sortable: true, resizable: true },
    { headerName: 'Last Contacted Date', field: 'lastDateContacted', filter: true, sortable: true, resizable: true,
      valueFormatter: (params) => formatDate(params.data.lastDateContacted, 'MMM-y-d', 'en-US')
    }
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
    this.gridColumnApi.getColumn('name').setSort("asc");
  }

  ngOnInit(): void {
    this.getContacts();
  }

  //to get all contacts
  getContacts(){    
    this._contactService.getContacts().subscribe(
      data => this.rowData = data, 
      error => {
        this.showError(error);
      }      
    );
  }

  //On select of each row. Function called from accounting-period.component.html in (selectionChanged) ag grid
  showContactDetails(message: string) {
    var selectedRow = this.gridApi.getSelectedRows();
    this.showClickedContactInfo(selectedRow[0]);
  }

  showClickedContactInfo(data){
    this.router.navigate(['./contacts/'+ data.id]);
  }

  showError(error) {
    this.toastr.error(error, 'Error');
  }
}