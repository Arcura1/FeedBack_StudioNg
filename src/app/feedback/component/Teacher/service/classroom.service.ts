import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  private apiUrl = 'http://localhost:8080/classrooms/user'; // Backend URL

  constructor(private http: HttpClient) {}

  searchClassrooms(query: { name: any }) {
    return this.http.post<{ id: number; name: string }[]>('http://localhost:8080/classrooms/search', query);
  }

  getClassroomsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
  }
}
