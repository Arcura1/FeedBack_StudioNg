  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';

  export interface Authority {
    id: number;
    name: string;
  }

@Injectable({
  providedIn: 'root'
})
export class AuthorityService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getAuthoritiesByRole(roleId: number): Observable<Authority[]> {
    return this.http.get<Authority[]>(`${this.baseUrl}/authorities/getByRole/${roleId}`);
  }
}

