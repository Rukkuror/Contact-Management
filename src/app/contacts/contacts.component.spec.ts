import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { By } from '@angular/platform-browser';
import * as Rx from 'rxjs';
import { delay } from "rxjs/operators";
import { AgGridModule } from 'ag-grid-angular';
import { Router } from '@angular/router';

import { ContactsComponent } from './contacts.component';
import { ContactService } from '../service/contact.service';


describe('ContactsComponent', () => {
  let component: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;
  let contactService: ContactService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsComponent ],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        AgGridModule.withComponents([]),
      ],
      providers: [ 
        ContactService,
        ToastrService
      ]
    })
    .compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the contacts', () => {
    expect(component).toBeTruthy();
  });

  it('should deduct a link with contacts/new', () => {
    let fixture = TestBed.createComponent(ContactsComponent);
    fixture.detectChanges();

    let href = fixture.debugElement.query(By.css('.new-create-link')).nativeElement.getAttribute('href');
    expect(href).toEqual('/contacts/new');
  });

  it('should deduct a link with text', () => {
    let fixture = TestBed.createComponent(ContactsComponent);
    fixture.detectChanges();

    let text = fixture.debugElement.query(By.css('.new-create-link')).nativeElement.innerText;
    expect(text).toEqual('Create New Contact');
  });
 
  it('should have 6 columns', () => {
    const fixture = TestBed.createComponent(ContactsComponent);
    fixture.detectChanges();

    const grid: HTMLElement = fixture.nativeElement
    const headers = grid.querySelectorAll('div[role=columnheader]')
    expect(headers.length).toBe(6);
  });

  it('should have expected 6 column headers names', fakeAsync( async () => {
    const fixture = TestBed.createComponent(ContactsComponent);
    fixture.detectChanges();

    const elm = fixture.nativeElement;
    const grid = elm.querySelector('ag-grid-angular');
    const headerCells = grid.querySelectorAll('.ag-header-cell-text');
    const headerTitles = Array.from(headerCells).map((cell: any) =>
        cell.textContent.trim()
    );
    expect(headerTitles).toEqual(['Name (Job Title)', 'Company', 'Phone', 'Address', 'Email', 'Last Contacted Date']);
    flush();
  }));

  it('should call getContacts and get response as empty array', fakeAsync(() => {
    const fixture = TestBed.createComponent(ContactsComponent);
    const component = fixture.debugElement.componentInstance;
    const service = fixture.debugElement.injector.get(ContactService);
    let spy_getPosts = spyOn(service, "getContacts").and.callFake(() => {
      return Rx.of([]).pipe(delay(100));
    });
    component.getContacts();
    tick(100);
    expect(component.rowData).toEqual([]);
  }));

  it('should call getContacts and get response as array', fakeAsync(() => {
    const fixture = TestBed.createComponent(ContactsComponent);
    const component = fixture.debugElement.componentInstance;
    const service = fixture.debugElement.injector.get(ContactService);
    let spy_getPosts = spyOn(service, "getContacts").and.callFake(() => {
      return Rx.of([{name: "Test"}]).pipe(delay(100));
    });
    component.getContacts();
    tick(100);
    expect(component.rowData).toEqual([{name: "Test"}]);
  }));

  it('should call the error toast', fakeAsync(() => {
    spyOn(component, 'showError').and.callThrough();
    component.showError('error');
    expect(component.showError).toBeTruthy();
    flush();
  }));

  it('should navigate to contacts get by ID', () => {
    const component = fixture.componentInstance;
    const navigateSpy = spyOn(router, 'navigate');
    component.showClickedContactInfo({id: 1});
    expect(navigateSpy).toHaveBeenCalledWith(['./contacts/1']);
  });
});
