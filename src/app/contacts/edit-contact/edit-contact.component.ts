import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, Validators, FormGroup, FormArray ,FormControl,NgForm} from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ContactService } from 'src/app/service/contact.service';
import {Router, ActivatedRoute} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
 
@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements OnInit {
  editContactForm: FormGroup;
  contact: Object;
  closeResult: string;
  modalReference: any;
  @ViewChild('confirmModal') confirmModal: any;
  
  constructor(public _contactService: ContactService, private fb: FormBuilder, private location: Location, 
    private route: ActivatedRoute, private router: Router, private modalService: NgbModal, private toastr: ToastrService) { }

  companyList = environment.companyList;

  ngOnInit(): void {
    //edit for init
    this.editContactForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      jobTitle: ['', Validators.required],
      company: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lastDateContacted: ['', Validators.required],
      comments: [''],
    }); 

    //call the get by id API
    this.route.params.subscribe(params => {
      this._contactService.getContact(params.id).subscribe(
        data => this.patchContactDetails(data), 
        error => {
          this.showError(error);
        }      
      );      
    });      
  }

  //patching the contact details
  patchContactDetails(data){
    this.editContactForm.patchValue(data);
  }

  get f() {
    return this.editContactForm.controls;
  }

  //Modal popup  open
  modalOpen(content) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true
    };
    this.modalReference = this.modalService.open(content, ngbModalOptions);
  }

  //Location back
  goBack() {
    this.location.back(); // <-- go back to previous location
  }

  //on click save in form, call confirm popup
  onConfirm(){
    this.modalOpen(this.confirmModal);
  }
  
  //after confirmation, call the update API
  updateContact(){
    this.modalReference.close();
    let x = this.editContactForm.value;
    this._contactService.updateContact(x).subscribe(
      data => {
        this.router.navigate(['/contacts']);
        this.contact = data;
        this.showSuccess();      
      },
      error => {
        this.showError(error);
      }     
    );    
  }

  //On success toastr
  showSuccess() {
    this.toastr.success('Contact Updated Successfully!', 'Success');
  }

  //On error toastr
  showError(error) {
    this.toastr.error(error, 'Error');
  }
}
