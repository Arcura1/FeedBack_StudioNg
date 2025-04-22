// authority-query-page.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Authority {
  id: number;
  name: string;
  description: string;
  authorityType: string;
  effectTypeEnum: string;
  classroomId: number;
  organizationId: number;
}

@Component({
  selector: 'app-authority-page',
  templateUrl: './authorityPage.component.html',
})
export class AuthorityPageComponent {
  query = {
    name: '',
    authorityType: '',
    effectTypeEnum: '',
    classroomId: null,
    organizationId: null,
  };

  authorities: Authority[] = [];
  loading = false;

  constructor(private http: HttpClient) {}

  searchAuthorities() {
    this.loading = true;

    // Sadece dolu olan alanları gönder
    const filteredQuery: any = {};

    for (const key in this.query) {
      const value = (this.query as any)[key];
      if (value !== '' && value !== null && value !== undefined) {
        filteredQuery[key] = value;
      } else {
        filteredQuery[key] = null;
      }
    }

    this.http.post<Authority[]>('http://localhost:8080/authorities/query', filteredQuery).subscribe({
      next: (data) => {
        this.authorities = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

}
