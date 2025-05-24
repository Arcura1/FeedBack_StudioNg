import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'adminPage',
  templateUrl: './adminPage.component.html',
  styleUrls: ['./adminPage.component.css']
})
export class AdminPageComponent implements OnInit {
  user: any = {};
  searchQuery: { name: string } = { name: '' };
  searchResults: any[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    console.log('Admin Paneli - Kullanıcı ID:', this.user.id);
    console.log('Admin Paneli - Kullanıcı Adı:', this.user.firstName);
    console.log('Admin Paneli - Rol:', this.user.role);
  }

  goToAdmin() {
    this.router.navigate(['/admin/settings']);
  }

  searchOrganizationByName(): void {
    if (!this.searchQuery.name) {
      alert('Lütfen bir kurum adı girin.');
      return;
    }

    this.http.post<any[]>('http://localhost:8080/organization/search', this.searchQuery)
      .subscribe(
        (result) => {
          this.searchResults = result;
          if (result.length === 0) {
            alert('Girilen ada uygun kurum bulunamadı.');
          }
        },
        (error) => {
          console.error('Arama hatası:', error);
          alert('Kurum arama sırasında bir hata oluştu!');
        }
      );
  }
}
