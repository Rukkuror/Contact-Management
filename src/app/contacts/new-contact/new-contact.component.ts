import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, Validators, FormGroup, FormArray ,FormControl,NgForm} from '@angular/forms';
import { ContactService } from 'src/app/service/contact.service';

@Component({
  selector: 'app-new-contact',
  templateUrl: './new-contact.component.html',
  styleUrls: ['./new-contact.component.css']
})
export class NewContactComponent implements OnInit {
  newContactForm: FormGroup;
  contact: Object;

  constructor(public _contactService: ContactService, private fb: FormBuilder, private location: Location) { }

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

  //Location back
  goBack() {
    this.location.back(); // <-- go back to previous location
  }
  
  createContact(){
    let x = this.newContactForm.value;
    console.log(x);
    this._contactService.createContact(x).subscribe(
      data => this.contact = data, 
      error => console.log('Error', error),      
    );    
  }
}
