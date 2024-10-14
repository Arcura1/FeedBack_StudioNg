import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: any;
  password: any;
  constructor(private router: Router) {}

  goToAbout() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.router.navigate(['/feedback']);

  }

  login() {

  }
}
