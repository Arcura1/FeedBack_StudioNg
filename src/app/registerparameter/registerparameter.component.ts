import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registerparameter',
  templateUrl: './registerparameter.component.html',
  styleUrls: ['./registerparameter.component.css']
})
export class RegisterparameterComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = 'GUEST';
  roleIdParam: number = 0;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  private apiUrl = 'http://localhost:8080/api/users/create';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    const roleParam = params['role'];
    const roleIdParam = params['roleId'];

    if (roleParam) {
      this.role = roleParam.toUpperCase();
    }

    if (roleIdParam) {
      this.roleIdParam = parseInt(roleIdParam);
    }
  });
}


  register() {
    const messageEl = document.getElementById('message');
    if (this.password !== this.confirmPassword) {
      messageEl!.innerHTML = `<div class="alert alert-danger">Şifreler eşleşmiyor!</div>`;
      return;
    }

    if (!this.firstName || !this.email || !this.password) {
      messageEl!.innerHTML = `<div class="alert alert-danger">Lütfen tüm zorunlu alanları doldurun!</div>`;
      return;
    }

    const newUser = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      password: this.password,
      role: this.role,
      roleId: this.roleIdParam
    };

    this.http.post(this.apiUrl, newUser).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        console.error(err);
        messageEl!.innerHTML = `<div class="alert alert-danger">Kayıt başarısız.</div>`;
      }
    });
  }
}
