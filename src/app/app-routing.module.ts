import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactsComponent } from './contacts/contacts.component';
import { NewContactComponent } from './contacts/new-contact/new-contact.component';
import { EditContactComponent } from './contacts/edit-contact/edit-contact.component';

const routes: Routes = [
  { path: '', redirectTo: 'contacts', pathMatch: 'full' },
  { path: 'contacts', component: ContactsComponent },
  { path: 'contacts', 
    children: [
    { path: 'new', component: NewContactComponent },
    { path: ':id', component: EditContactComponent }
  ]},    
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
