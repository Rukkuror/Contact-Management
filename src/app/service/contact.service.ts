import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

    constructor(private http: HttpClient) { }

    //to get all contacts - GET
    getContacts():Observable<any>{
        return this.http.get<any>(environment.contactsUrl);
    }

    //to get individual contact
    getContact(id):Observable<any>{
        return this.http.get<any>(environment.contactsUrl + id);
    }

    //to create contact - POST
    createContact(object: Object){
        return this.http.post(environment.contactsUrl, object);
    }

    //to update contact - PUT
    updateContact(object: Object){
        return this.http.put(environment.contactsUrl + object['id'], object);
    }
}