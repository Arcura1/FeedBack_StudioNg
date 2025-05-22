import { Component, OnInit } from '@angular/core';
import { AuthorityService, Authority } from './service/authority.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-custom-page',
  templateUrl: './customPage.component.html',
  styleUrls: ['./customPage.component.css']
})
export class CustomPageComponent implements OnInit {
  authorities: Authority[] = [];
  organizationAuthorities: Authority[] = [];
  pdfEditAuthorities: Authority[] = [];
  classroomAuthorities: Authority[] = [];
  homeworkAuthorities: Authority[] = [];

  selectedSection: string | null = null;

  organization: any = null;
  apiUrl: string = 'http://localhost:8080/organization';

  constructor(private authorityService: AuthorityService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAuthorities();
  }

  loadAuthorities(): void {
    const roleId = 11; // Sabit rol ID örneği
    this.authorityService.getAuthoritiesByRole(roleId).subscribe({
      next: (data: Authority[]) => {
        this.authorities = data;
        this.organizationAuthorities = data.filter(
          a => a.authorityType === 'ORGANIZATION' && a.organization
        );

        // 👇 İlk organization'ı forma doldur
        if (this.organizationAuthorities.length > 0) {
          const orgData = this.organizationAuthorities[0].organization;
          this.organization = {
            id: orgData.id,
            name: orgData.name,
            address: orgData.address,
            email: orgData.email
          };
        }
      },
      error: (err) => {
        console.error('Yetkiler yüklenemedi:', err);
      }
    });
  }

  toggleAccordion(section: string): void {
    this.selectedSection = this.selectedSection === section ? null : section;
  }

  saveOrganization(): void {
    if (!this.organization) return;

    const request = this.organization.id
      ? this.http.put(`${this.apiUrl}/${this.organization.id}`, this.organization)
      : this.http.post(this.apiUrl, this.organization);

    request.subscribe({
      next: () => {
        alert(`Organization ${this.organization.id ? 'güncellendi' : 'oluşturuldu'}.`);
        this.resetForm();
      },
      error: err => {
        console.error('Kaydetme hatası:', err);
        alert('Organization kaydedilirken hata oluştu.');
      }
    });
  }

  resetForm(): void {
    this.organization = null;
  }
}
