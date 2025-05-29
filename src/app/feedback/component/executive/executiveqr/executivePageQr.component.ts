import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-executivePageQr',
  templateUrl: './executivePageQr.component.html',
  styleUrls: ['./executivePageQr.component.css']
})
export class executivePageQr {
  roles: string[] = ['TEACHER', 'STUDENT'];
  selectedRole: string = '';
  organizations: any[] = [];
  selectedOrganizationId: number | null = null;

  qrUrl: string = '';
  baseUrl = 'http://localhost:4200/registerparameter';

  constructor(private http: HttpClient) {}

  onRoleSelect() {
    this.organizations = [];
    this.selectedOrganizationId = null;
    this.qrUrl = '';

    const payload = { name: '', roleTypeEnum: this.selectedRole };
    this.http.post<any[]>('http://localhost:8080/roles/query', payload)
      .subscribe(data => {
        this.organizations = data;
      });
  }

  onOrganizationSelect() {
    if (this.selectedRole && this.selectedOrganizationId) {
      this.qrUrl = `${this.baseUrl}?role=${this.selectedRole}&roleId=${this.selectedOrganizationId}`;
    }
  }
}
