import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './service/http-error.interceptor';
import { AgGridModule } from 'ag-grid-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactsComponent } from './contacts/contacts.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

import { NewContactComponent } from './contacts/new-contact/new-contact.component';
import { EditContactComponent } from './contacts/edit-contact/edit-contact.component';

@NgModule({
  declarations: [
    AppComponent,
    ContactsComponent,
    NewContactComponent,
    EditContactComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AgGridModule.withComponents([]),
    NgbModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(), // ToastrModule added
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,  useClass: HttpErrorInterceptor,  multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
