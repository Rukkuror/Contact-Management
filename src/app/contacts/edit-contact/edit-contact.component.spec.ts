import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { EditContactComponent } from './edit-contact.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ContactService } from '../../service/contact.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { By, BrowserModule } from '@angular/platform-browser';
import { NgbModal, NgbModule, NgbModalRef  } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';

// Mock class for NgbModalRef
export class MockNgbModalRef {
  componentInstance = {
    prompt: 'Are you sure want to update this contact?'
  };
  result: Promise<any> = new Promise((resolve, reject) => resolve('x'));
}


describe('EditContactComponent', () => {
  let component: EditContactComponent;
  let fixture: ComponentFixture<EditContactComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let modalService: NgbModal;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();
  let location: SpyLocation;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditContactComponent ],
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
    fixture = TestBed.createComponent(EditContactComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(NgbModal);
    location = TestBed.get(Location);
    component.ngOnInit();
    de = fixture.debugElement.query(By.css("form"));
    el = de.nativeElement;
    fixture.detectChanges();
  });

  it('should create the edit contact', () => {
    expect(component).toBeTruthy();
  });

  it('should have cancel', () => {
    let fixture = TestBed.createComponent(EditContactComponent);
    fixture.detectChanges();
    
    let text = fixture.debugElement.query(By.css('.cancel')).nativeElement.innerText;
    expect(text).toEqual('Cancel');
  });

  it('should form invalid when empty', () => {
    expect(component.editContactForm.valid).toBeFalsy();
  });

  it('should name field validity', () => {
      let name = component.editContactForm.controls['name'];
      expect(name.valid).toBeFalsy();

      name.setValue("");
      expect(name.hasError('required')).toBeTruthy();
  });

  it('should job title field validity', () => {
    let jobTitle = component.editContactForm.controls['jobTitle'];
    expect(jobTitle.valid).toBeFalsy();

    jobTitle.setValue("");
    expect(jobTitle.hasError('required')).toBeTruthy();
  });

  it('should company field validity', () => {
    let company = component.editContactForm.controls['company'];
    expect(company.valid).toBeFalsy();

    company.setValue("");
    expect(company.hasError('required')).toBeTruthy();
  });

  it('should email field validity', () => {
    let email = component.editContactForm.controls['email'];
    expect(email.valid).toBeFalsy();

    email.setValue("");
    expect(email.hasError('required')).toBeTruthy();
  });

  it('should address field validity', () => {
    let address = component.editContactForm.controls['address'];
    expect(address.valid).toBeFalsy();

    address.setValue("");
    expect(address.hasError('required')).toBeTruthy();
  });

  it('should phone field validity', () => {
    let phone = component.editContactForm.controls['phone'];
    expect(phone.valid).toBeFalsy();

    phone.setValue("");
    expect(phone.hasError('required')).toBeTruthy();
  });

  it('should last date contacted field validity', () => {
    let lastDateContacted = component.editContactForm.controls['lastDateContacted'];
    expect(lastDateContacted.valid).toBeFalsy();

    lastDateContacted.setValue("");
    expect(lastDateContacted.hasError('required')).toBeTruthy();
  });

  it('should test if submit button is enabled when the form is valid', () => {
    component.editContactForm.controls['name'].setValue('test');
    component.editContactForm.controls['jobTitle'].setValue('test');
    component.editContactForm.controls['company'].setValue('HP');
    component.editContactForm.controls['address'].setValue('test');
    component.editContactForm.controls['phone'].setValue('1231231234');
    component.editContactForm.controls['email'].setValue('testemail@sdfds.com');
    component.editContactForm.controls['lastDateContacted'].setValue('2021/03/03');
    fixture.detectChanges();
    expect(el.querySelector('button').disabled).toBeFalsy();
  });
  
  it('should test if submit button is disabled when the form is invalid -- Required fields are empty', async(() => {
    component.editContactForm.controls['name'].setValue('');
    component.editContactForm.controls['jobTitle'].setValue('');
    component.editContactForm.controls['company'].setValue('');
    component.editContactForm.controls['address'].setValue('');
    component.editContactForm.controls['phone'].setValue('');
    component.editContactForm.controls['email'].setValue('');
    component.editContactForm.controls['lastDateContacted'].setValue('');
    fixture.detectChanges();
    expect(el.querySelector('button').disabled).toBeTruthy();
  }));

  it('should trigger a click event and open modal popup', fakeAsync(() => {
    component.editContactForm.controls['name'].setValue('test');
    component.editContactForm.controls['jobTitle'].setValue('test');
    component.editContactForm.controls['company'].setValue('HP');
    component.editContactForm.controls['address'].setValue('test');
    component.editContactForm.controls['phone'].setValue('1231231234');
    component.editContactForm.controls['email'].setValue('testemail@test.com');
    component.editContactForm.controls['lastDateContacted'].setValue('03/03/2021');
    component.editContactForm.controls['comments'].setValue('test comments');
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
    expect(mockModalRef.componentInstance.prompt).toBe('Are you sure want to update this contact?');
  });

  it('should trigger a click event, open modal popup and create contact', fakeAsync(() => {
    component.editContactForm.controls['name'].setValue('test');
    component.editContactForm.controls['jobTitle'].setValue('test');
    component.editContactForm.controls['company'].setValue('HP');
    component.editContactForm.controls['address'].setValue('test');
    component.editContactForm.controls['phone'].setValue('1231231234');
    component.editContactForm.controls['email'].setValue('testemail@sdfds.com');
    component.editContactForm.controls['lastDateContacted'].setValue('03/03/2021');
    component.editContactForm.controls['comments'].setValue('test comments');
    fixture.detectChanges();
    el.querySelector('button').click();
    tick();
    spyOn(modalService, 'open').and.callThrough();
    component.modalOpen('<xxxx>');
    expect(modalService.open).toHaveBeenCalledWith('<xxxx>', { backdrop: 'static', keyboard: false, centered: true });
    component.updateContact();
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
});