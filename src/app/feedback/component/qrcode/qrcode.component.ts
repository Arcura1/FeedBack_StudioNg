import { Component } from '@angular/core';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QrcodeComponent {
  baseUrl: string = 'http://localhost:4200/registerparameter?role=';
  roles: string[] = ['ADMIN', 'TEACHER', 'STUDENT', 'EXECUTIVE', 'CUSTOM', 'GUEST'];
  targetUrl: string = '';

  updateUrl(role: string) {
    this.targetUrl = `${this.baseUrl}${role}`;
  }
}
