import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface OrganizationQueryDTO {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = 'http://localhost:8080/organization/search'; // Backend URL

  constructor(private http: HttpClient) {}

  searchOrganizations(query: OrganizationQueryDTO): Observable<any> {
    return this.http.post<any>(this.apiUrl, query);
  }
}
