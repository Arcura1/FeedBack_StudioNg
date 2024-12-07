import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'nawbarfeed',
  templateUrl: './nawbar.components.html',
  standalone: true
})
export class NavbarComponent {
  constructor(private router: Router) {}

  goToProfile() {
    this.router.navigate(['/feedback/profile']);
  }

  goToMain() {
    this.router.navigate(['/feedback/main']);
  }
}
