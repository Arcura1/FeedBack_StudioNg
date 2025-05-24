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

  // ORGANIZATION
  organizationAuthorities: Authority[] = [];
  selectedAuthority: Authority | null = null;
  organization: any = null;

  // CLASSROOM
  classroomAuthorities: Authority[] = [];
  selectedClassroomAuthority: Authority | null = null;
  classroom: any = null;

  // HOMEWORK
  homeworkAuthorities: Authority[] = [];
  selectedHomeworkAuthority: Authority | null = null;
  homework: any = null;

  // PDF_EDIT
  pdfEditAuthorities: Authority[] = [];
  selectedPdfAuthority: Authority | null = null;
  pdf: any = null;

  // CLASSROOM_USER
  classroomUserAuthorities: Authority[] = [];
  selectedClassroomUserAuthority: Authority | null = null;
  classroomUser: any = null;

  // UI
  selectedSection: string | null = null;

  // API URL’leri
  apiUrlOrg = 'http://localhost:8080/organization';
  apiUrlClassroom = 'http://localhost:8080/classrooms';
  apiUrlHomework = 'http://localhost:8080/homework';
  apiUrlPdf = 'http://localhost:8080/pdf';
  apiUrlClassroomUser = 'http://localhost:8080/classroom-user';

  constructor(
    private authorityService: AuthorityService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadAuthorities();
  }

  loadAuthorities(): void {
    const roleId = 11;

    this.authorityService.getAuthoritiesByRole(roleId).subscribe({
      next: (data: Authority[]) => {
        this.authorities = data;

        this.organizationAuthorities = data.filter(a => a.authorityType === 'ORGANIZATION' && a.organization);
        this.classroomAuthorities = data.filter(a => a.authorityType === 'CLASSROOM' && a.classroom);
        this.homeworkAuthorities = data.filter(a => a.authorityType === 'HOMEWORK' && a.homework);
        this.pdfEditAuthorities = data.filter(a => a.authorityType === 'PDF_EDIT' && a.pdfInfo);
        this.classroomUserAuthorities = data.filter(a => a.authorityType === 'CLASSROOM_USER' && a.classroomUser);
      },
      error: err => {
        console.error('Yetkiler yüklenemedi:', err);
      }
    });
  }

  toggleAccordion(section: string): void {
    this.selectedSection = this.selectedSection === section ? null : section;
  }

  // ORGANIZATION
  onSelectOrganization(value: string): void {
    const [id, effect] = value.split('|');
    const selected = this.organizationAuthorities.find(a => a.organization?.id === +id && a.effectTypeEnum === effect);
    this.selectedAuthority = selected ?? null;
    this.organization = selected?.organization ?? null;
  }

  saveOrganization(): void {
    if (!this.organization) return;
    const req = this.organization.id
      ? this.http.put(`${this.apiUrlOrg}/${this.organization.id}`, this.organization)
      : this.http.post(this.apiUrlOrg, this.organization);
    req.subscribe({
      next: () => {
        alert('Organization kaydedildi.');
        this.resetForm();
        this.loadAuthorities();
      },
      error: err => alert('Organization kaydedilirken hata.')
    });
  }

  resetForm(): void {
    this.organization = null;
    this.selectedAuthority = null;
  }

  // CLASSROOM
  onSelectClassroom(value: string): void {
    const [id, effect] = value.split('|');
    const selected = this.classroomAuthorities.find(a => a.classroom?.id === +id && a.effectTypeEnum === effect);
    this.selectedClassroomAuthority = selected ?? null;
    this.classroom = selected?.classroom ?? null;
  }

  saveClassroom(): void {
    if (!this.classroom) return;
    const req = this.classroom.id
      ? this.http.put(`${this.apiUrlClassroom}/${this.classroom.id}`, this.classroom)
      : this.http.post(this.apiUrlClassroom, this.classroom);
    req.subscribe({
      next: () => {
        alert('Sınıf kaydedildi.');
        this.resetClassroomForm();
        this.loadAuthorities();
      },
      error: err => alert('Sınıf kaydedilirken hata.')
    });
  }

  resetClassroomForm(): void {
    this.classroom = null;
    this.selectedClassroomAuthority = null;
  }

  // HOMEWORK
  onSelectHomework(value: string): void {
    const [id, effect] = value.split('|');
    const selected = this.homeworkAuthorities.find(a => a.homework?.id === +id && a.effectTypeEnum === effect);
    this.selectedHomeworkAuthority = selected ?? null;
    this.homework = selected?.homework ?? null;
  }

  saveHomework(): void {
    if (!this.homework) return;
    const req = this.homework.id
      ? this.http.put(`${this.apiUrlHomework}/${this.homework.id}`, this.homework)
      : this.http.post(this.apiUrlHomework, this.homework);
    req.subscribe({
      next: () => {
        alert('Ödev kaydedildi.');
        this.resetHomeworkForm();
        this.loadAuthorities();
      },
      error: err => alert('Ödev kaydedilirken hata.')
    });
  }

  resetHomeworkForm(): void {
    this.homework = null;
    this.selectedHomeworkAuthority = null;
  }

  // PDF
  onSelectPdf(value: string): void {
    const [id, effect] = value.split('|');
    const selected = this.pdfEditAuthorities.find(a => a.pdfInfo?.id === +id && a.effectTypeEnum === effect);
    this.selectedPdfAuthority = selected ?? null;
    this.pdf = selected?.pdfInfo ?? null;
  }

  savePdf(): void {
    if (!this.pdf) return;
    const req = this.pdf.id
      ? this.http.put(`${this.apiUrlPdf}/${this.pdf.id}`, this.pdf)
      : this.http.post(this.apiUrlPdf, this.pdf);
    req.subscribe({
      next: () => {
        alert('PDF kaydedildi.');
        this.resetPdfForm();
        this.loadAuthorities();
      },
      error: err => alert('PDF kaydedilirken hata.')
    });
  }

  resetPdfForm(): void {
    this.pdf = null;
    this.selectedPdfAuthority = null;
  }

  // CLASSROOM_USER
  onSelectClassroomUser(value: string): void {
    const [id, effect] = value.split('|');
    const selected = this.classroomUserAuthorities.find(a => a.classroomUser?.id === +id && a.effectTypeEnum === effect);
    this.selectedClassroomUserAuthority = selected ?? null;
    this.classroomUser = selected?.classroomUser ?? null;
  }

  saveClassroomUser(): void {
    if (!this.classroomUser) return;
    const req = this.classroomUser.id
      ? this.http.put(`${this.apiUrlClassroomUser}/${this.classroomUser.id}`, this.classroomUser)
      : this.http.post(this.apiUrlClassroomUser, this.classroomUser);
    req.subscribe({
      next: () => {
        alert('Sınıf kullanıcısı kaydedildi.');
        this.resetClassroomUserForm();
        this.loadAuthorities();
      },
      error: err => alert('Sınıf kullanıcısı kaydedilirken hata.')
    });
  }

  resetClassroomUserForm(): void {
    this.classroomUser = null;
    this.selectedClassroomUserAuthority = null;
  }
}
