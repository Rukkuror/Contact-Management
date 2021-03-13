import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
    private baseUrl = 'http://localhost:3000/contacts';

    constructor(private http: HttpClient) { }

    //to get all contacts
    getContacts():Observable<any>{
        return this.http.get<any>(this.baseUrl);
    }
}