import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Organization {
  id?: number;
  name: string;
  address: string;
  email: string;
}

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html'
})
export class OrganizationComponent implements OnInit {
  organizations: Organization[] = [];
  organization: Organization = { name: '', address: '', email: '' };
  apiUrl: string = 'http://localhost:8080/organization';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadOrganizations();
  }

  loadOrganizations(): void {
    this.http.get<Organization[]>(this.apiUrl).subscribe(
      data => this.organizations = data,
      error => {
        console.error('Organization listesi yüklenirken hata oluştu:', error);
        alert('Organization listesi yüklenirken hata oluştu!');
      }
    );
  }

  saveOrganization(): void {
    if (this.organization.id) {
      // Güncelleme işlemi
      this.http.put<Organization>(`${this.apiUrl}/${this.organization.id}`, this.organization)
        .subscribe(
          data => {
            alert('Organization güncellendi.');
            this.resetForm();
            this.loadOrganizations();
          },
          error => {
            console.error('Güncelleme hatası:', error);
            alert('Organization güncellenirken hata oluştu!');
          }
        );
    } else {
      // Oluşturma işlemi
      this.http.post<Organization>(this.apiUrl, this.organization)
        .subscribe(
          data => {
            alert('Organization oluşturuldu.');
            this.resetForm();
            this.loadOrganizations();
          },
          error => {
            console.error('Oluşturma hatası:', error);
            alert('Organization oluşturulurken hata oluştu!');
          }
        );
    }
  }

  editOrganization(org: Organization): void {
    // Düzenleme için seçilen organization bilgisini forma yükle
    this.organization = { ...org };
  }

  deleteOrganization(id: number | undefined): void {
    if (!id) return;
    if (confirm('Bu organization silinsin mi?')) {
      this.http.delete(`${this.apiUrl}/${id}`)
        .subscribe(
          () => {
            alert('Organization silindi.');
            this.loadOrganizations();
          },
          error => {
            console.error('Silme hatası:', error);
            alert('Organization silinirken hata oluştu!');
          }
        );
    }
  }

  resetForm(): void {
    this.organization = { name: '', address: '', email: '' };
  }
}
