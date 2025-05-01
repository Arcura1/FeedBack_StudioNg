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

  constructor(private authorityService: AuthorityService, private router: Router) {}

  ngOnInit(): void {
    this.loadAuthorities();
  }

loadAuthorities() {
  const roleId = 11; // örnek id
  this.authorityService.getAuthoritiesByRole(roleId).subscribe({
    next: (data) => {
      console.log("Gelen veri:", data);
      this.authorities = data;
    },
    error: (err) => {
      console.error("Yetki alınamadı:", err);
    }
  });
}

  goToCustom() {
    this.router.navigate(['/custom-panel']);
  }
}
