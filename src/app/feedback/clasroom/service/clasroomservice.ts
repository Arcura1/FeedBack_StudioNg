import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = 'http://localhost:8080/organization';

  constructor(private http: HttpClient) {}

  getOrganizations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
