import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Classroom {
  id: number;
  name: string;
  floor: number;
  roomNumber: string;
  capacity: number;
  description?: string; // opsiyonel olarak ekle
}

export interface Authority {
  id: number;
  name: string;
  description: string;
  authorityType: string;
  effectTypeEnum: string;
  classroomId?: number;
  classroom?: Classroom;
  classroomUserId?: number;
  classroomUser?: any;
  homeworkId?: number;
  homework?: any;
  pdfInfoId?: number;
  pdfInfo?: any;
  organizationId?: number;
  organization?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthorityService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getAuthoritiesByRole(roleId: number): Observable<Authority[]> {
    const url = `${this.baseUrl}/authorities/getByRole/${roleId}`;
    return this.http.get<Authority[]>(url);
  }
}
