import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { NewContactComponent } from './new-contact.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ContactService } from '../../service/contact.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { By, BrowserModule } from '@angular/platform-browser';
import { NgbModal, NgbModule, NgbModalRef  } from '@ng-bootstrap/ng-bootstrap';
import * as Rx from 'rxjs';
import { delay } from "rxjs/operators";
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';

// Mock class for NgbModalRef
export class MockNgbModalRef {
  componentInstance = {
    prompt: 'Are you sure want to create a new contact?'
  };
  result: Promise<any> = new Promise((resolve, reject) => resolve('x'));
}

describe('NewContactComponent', () => {
  let component: NewContactComponent;
  let fixture: ComponentFixture<NewContactComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let modalService: NgbModal;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();
  let toastrService: ToastrService;
  let location: SpyLocation;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewContactComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        NgbModule,
        ToastrModule.forRoot()
      ],
      providers: [ 
        ContactService,
        ToastrService,
        { provide: Location, useClass: SpyLocation }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewContactComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(NgbModal);
    location = TestBed.get(Location);
    component.ngOnInit();
    de = fixture.debugElement.query(By.css("form"));
    el = de.nativeElement;
    fixture.detectChanges();
  });

  it('should create the new contact', () => {
    expect(component).toBeTruthy();
  });

  it('should have cancel', () => {
    let fixture = TestBed.createComponent(NewContactComponent);
    fixture.detectChanges();
    
    let text = fixture.debugElement.query(By.css('.cancel')).nativeElement.innerText;
    expect(text).toEqual('Cancel');
  });

  it('should form invalid when empty', () => {
    expect(component.newContactForm.valid).toBeFalsy();
  });

  it('should name field validity', () => {
      let name = component.newContactForm.controls['name'];
      expect(name.valid).toBeFalsy();

      name.setValue("");
      expect(name.hasError('required')).toBeTruthy();
  });

  it('should job title field validity', () => {
    let jobTitle = component.newContactForm.controls['jobTitle'];
    expect(jobTitle.valid).toBeFalsy();

    jobTitle.setValue("");
    expect(jobTitle.hasError('required')).toBeTruthy();
  });

  it('should company field validity', () => {
    let company = component.newContactForm.controls['company'];
    expect(company.valid).toBeFalsy();

    company.setValue("");
    expect(company.hasError('required')).toBeTruthy();
  });

  it('should email field validity', () => {
    let email = component.newContactForm.controls['email'];
    expect(email.valid).toBeFalsy();

    email.setValue("");
    expect(email.hasError('required')).toBeTruthy();
  });

  it('should address field validity', () => {
    let address = component.newContactForm.controls['address'];
    expect(address.valid).toBeFalsy();

    address.setValue("");
    expect(address.hasError('required')).toBeTruthy();
  });

  it('should phone field validity', () => {
    let phone = component.newContactForm.controls['phone'];
    expect(phone.valid).toBeFalsy();

    phone.setValue("");
    expect(phone.hasError('required')).toBeTruthy();
  });

  it('should last date contacted field validity', () => {
    let lastDateContacted = component.newContactForm.controls['lastDateContacted'];
    expect(lastDateContacted.valid).toBeFalsy();

    lastDateContacted.setValue("");
    expect(lastDateContacted.hasError('required')).toBeTruthy();
  });

  it('should test if submit button is enabled when the form is valid', () => {
    component.newContactForm.controls['name'].setValue('test');
    component.newContactForm.controls['jobTitle'].setValue('test');
    component.newContactForm.controls['company'].setValue('HP');
    component.newContactForm.controls['address'].setValue('test');
    component.newContactForm.controls['phone'].setValue('1231231234');
    component.newContactForm.controls['email'].setValue('testemail@sdfds.com');
    component.newContactForm.controls['lastDateContacted'].setValue('2021/03/03');
    fixture.detectChanges();
    expect(el.querySelector('button').disabled).toBeFalsy();
  });
  
  it('should test if submit button is disabled when the form is invalid -- Required fields are empty', async(() => {
    component.newContactForm.controls['name'].setValue('');
    component.newContactForm.controls['jobTitle'].setValue('');
    component.newContactForm.controls['company'].setValue('');
    component.newContactForm.controls['address'].setValue('');
    component.newContactForm.controls['phone'].setValue('');
    component.newContactForm.controls['email'].setValue('');
    component.newContactForm.controls['lastDateContacted'].setValue('');
    fixture.detectChanges();
    expect(el.querySelector('button').disabled).toBeTruthy();
  }));

  it('should trigger a click event and open modal popup', fakeAsync(() => {
    component.newContactForm.controls['name'].setValue('test');
    component.newContactForm.controls['jobTitle'].setValue('test');
    component.newContactForm.controls['company'].setValue('HP');
    component.newContactForm.controls['address'].setValue('test');
    component.newContactForm.controls['phone'].setValue('1231231234');
    component.newContactForm.controls['email'].setValue('testemail@sdfds.com');
    component.newContactForm.controls['lastDateContacted'].setValue('03/03/2021');
    component.newContactForm.controls['comments'].setValue('test comments');
    fixture.detectChanges();
    el.querySelector('button').click();
    tick();
    spyOn(modalService, 'open').and.callThrough();
    component.modalOpen('<xxxx>');
    expect(modalService.open).toHaveBeenCalledWith('<xxxx>', { backdrop: 'static', keyboard: false, centered: true });
    flush();
  }));

  it('should set prompt', () => {
    spyOn(modalService, 'open').and.callThrough();
    component.onConfirm();
    expect(mockModalRef.componentInstance.prompt).toBe('Are you sure want to create a new contact?');
  });

  it('should trigger a click event, open modal popup and create contact', fakeAsync(() => {
    component.newContactForm.controls['name'].setValue('test');
    component.newContactForm.controls['jobTitle'].setValue('test');
    component.newContactForm.controls['company'].setValue('HP');
    component.newContactForm.controls['address'].setValue('test');
    component.newContactForm.controls['phone'].setValue('1231231234');
    component.newContactForm.controls['email'].setValue('testemail@sdfds.com');
    component.newContactForm.controls['lastDateContacted'].setValue('03/03/2021');
    component.newContactForm.controls['comments'].setValue('test comments');
    fixture.detectChanges();
    el.querySelector('button').click();
    tick();
    spyOn(modalService, 'open').and.callThrough();
    component.modalOpen('<xxxx>');
    expect(modalService.open).toHaveBeenCalledWith('<xxxx>', { backdrop: 'static', keyboard: false, centered: true });
    component.createContact();
    flush();
  }));

  it('should call the success toast', fakeAsync(() => {
    spyOn(component, 'showSuccess').and.callThrough();
    component.showSuccess();
    expect(component.showSuccess).toHaveBeenCalledWith();
    flush();
  }));

  it('should call the error toast', fakeAsync(() => {
    spyOn(component, 'showError').and.callThrough();
    component.showError('error');
    expect(component.showError).toBeTruthy();
    flush();
  }));

  it('should go back to previous page', () => {
    spyOn(location, 'back');
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });

  it('should go back to previous page', () => {
    spyOn(location, 'back');
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });
});