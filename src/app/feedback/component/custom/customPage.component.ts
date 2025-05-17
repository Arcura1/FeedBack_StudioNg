import { Component, OnInit } from '@angular/core';
import { AuthorityService, Authority } from './service/authority.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custom-page',
  templateUrl: './customPage.component.html',
  styleUrls: ['./customPage.component.css']
})
export class CustomPageComponent implements OnInit {
  authorities: Authority[] = [];
  selectedSection: string | null = null;

  organizationAuthorities: Authority[] = [];
  pdfEditAuthorities: Authority[] = [];
  classroomAuthorities: Authority[] = [];
  homeworkAuthorities: Authority[] = [];

  constructor(private authorityService: AuthorityService, private router: Router) {}

  ngOnInit(): void {
    this.loadAuthorities();
  }

  loadAuthorities(): void {
    const roleId = 11;
    this.authorityService.getAuthoritiesByRole(roleId).subscribe({
      next: (data: Authority[]) => {
        this.authorities = data;
console.log("Gelen veri:", data);
        // Ayrı ayrı kategorilere ayır
        this.organizationAuthorities = data.filter(a => a.authorityType === 'ORGANIZATION');
        this.pdfEditAuthorities = data.filter(a => a.authorityType === 'PDF_EDIT');
        this.classroomAuthorities = data.filter(a => a.authorityType === 'CLASSROOM');
        this.homeworkAuthorities = data.filter(a => a.authorityType === 'HOMEWORK');
      },
      error: (err) => {
        console.error('Yetki alınamadı:', err);
      }
    });
  }

  toggleAccordion(section: string): void {
    this.selectedSection = this.selectedSection === section ? null : section;
  }
}
