import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, Validators, FormGroup, FormArray ,FormControl,NgForm} from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ContactService } from 'src/app/service/contact.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
 
@Component({
  selector: 'app-new-contact',
  templateUrl: './new-contact.component.html',
  styleUrls: ['./new-contact.component.css']
})
export class NewContactComponent implements OnInit {
  newContactForm: FormGroup;
  contact: Object;
  closeResult: string;
  modalReference: any;
  @ViewChild('confirmModal') confirmModal: any;

  constructor(public _contactService: ContactService, private fb: FormBuilder, private location: Location,
    private modalService: NgbModal, private router: Router, private toastr: ToastrService) { }

  companyList = [
    {name: "ABC Company"},
    {name: "XYZ Corp"},
    {name: "World Wide"}
  ]

  ngOnInit(): void {
    this.newContactForm = this.fb.group({
      name: ['', Validators.required],
      jobTitle: ['', Validators.required],
      company: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      lastDateContacted: ['', Validators.required],
      comments: [''],
    });
  }

  //Modal popup  open
  modalOpen(content) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true
    };
    this.modalReference = this.modalService.open(content, ngbModalOptions);
    this.modalReference.result.then((result) => {
      this.closeResult = 'Closed with: ${result}';
    }, (reason) => {
      this.closeResult = 'Dismissed';
    });
  }

  //Location back
  goBack() {
    this.location.back(); // <-- go back to previous location
  }
  
  onConfirm(){
    this.modalOpen(this.confirmModal);
  }

  createContact(){
    this.modalReference.close();
    let x = this.newContactForm.value;
    this._contactService.createContact(x).subscribe(      
      data => {
          this.router.navigate(['/contacts']);
          this.contact = data;
          this.showSuccess();      
      }, 
      error => ( this.showError() ) 
    );    
  }

  showSuccess() {
    this.toastr.success('Contact Added Successfully!', 'Success');
  }
  
  showError() {
    this.toastr.success('Something went wrong', 'Error');
  }

}
