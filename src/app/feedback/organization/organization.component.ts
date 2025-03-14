import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Organization {
  id?: number;
  name: string;
  address: string;
  email: string;
  userId: number;
}

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html'
})
export class OrganizationComponent implements OnInit {
  user: any = {}; // Kullanıcı bilgilerini saklamak için değişken

  organizations: Organization[] = [];
  organization: Organization = { name: '', address: '', email: '',userId: this.user.id};
  apiUrl: string = 'http://localhost:8080/organization';
  protected PickerUser: any[] | undefined;

  constructor(private http: HttpClient) {

    this.user= JSON.parse(sessionStorage.getItem('user') || '{}');
    this.organization = { name: '', address: '', email: '',userId: this.user.id};
  }

  ngOnInit(): void {

    console.log(this.user.id)
    console.log(this.organization )
    this.organization = { name: '', address: '', email: '',userId: this.user.id};
    this.loadUsers()

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
            console.log(this.organization)
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

  loadUsers() {
    this.http.get<any[]>('http://localhost:8080/api/users/type/EXECUTIVE').subscribe(
      (data) => {
        console.log(data)
        this.PickerUser = data.map(user => user);
        this.PickerUser = data
      },
      (error) => {
        console.error('Kurum tipleri yüklenirken hata oluştu:', error);
      }
    );
  }

  resetForm(): void {
    this.organization = { name: '', address: '', email: '' ,userId: this.user.id};
  }
}
