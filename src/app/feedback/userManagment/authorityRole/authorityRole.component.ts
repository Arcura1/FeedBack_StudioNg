import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {debounceTime, Subject, switchMap} from "rxjs";

interface RoleAuthority {
  id?: number;
  roleName: string;
  authorityName: string;
}
interface Authority {
  id: number;
  name: string;
  description: string;
  authorityType: string;
  effectTypeEnum: string;
  classroomId: number;
  organizationId: number;
}
@Component({
  selector: 'app-authority-role',
  templateUrl: './authorityRole.component.html',
  styleUrls: ['./authorityRole.component.css']
})
export class AuthorityRoleComponent implements OnInit {
  roleAuthorities: RoleAuthority[] = [];
  newRelation: RoleAuthority = { roleName: '', authorityName: '' };
  selectedId: number | null = null;

  filteredAuthorities: Authority[] = [];
  showSuggestions = false;


  private searchSubject = new Subject<string>();


  constructor(private http: HttpClient) {
    this.searchSubject.pipe(
      debounceTime(300),
      switchMap((text) => this.fetchAuthorities(text))
    ).subscribe((data) => {
      this.filteredAuthorities = data;
      this.showSuggestions = true;
    });
  }

  ngOnInit(): void {
    this.fetchAll();
  }



  onAuthorityNameChange(): void {
    const name = this.newRelation.authorityName;
    if (name && name.trim().length > 0) {
      this.searchSubject.next(name.trim());
    } else {
      this.filteredAuthorities = [];
      this.showSuggestions = false;
    }
  }

  fetchAuthorities(name: string) {
    const body = {
      name,
      authorityType: null,
      effectTypeEnum: null,
      classroomId: null,
      organizationId: null
    };
    return this.http.post<Authority[]>('http://localhost:8080/authorities/query', body);
  }

  selectAuthority(authority: Authority): void {
    this.newRelation.authorityName = authority.name;
    this.showSuggestions = false;
  }

  hideSuggestions(): void {
    setTimeout(() => this.showSuggestions = false, 200); // küçük timeout, tıklamaya zaman tanır
  }







  fetchAll() {
    this.http.get<RoleAuthority[]>('/api/role-authorities').subscribe(data => {
      this.roleAuthorities = data;
    });
  }

  save() {
    const payload = { ...this.newRelation };

    if (this.selectedId) {
      this.http.put(`/api/role-authorities/${this.selectedId}`, payload).subscribe(() => {
        this.fetchAll();
        this.reset();
      });
    } else {
      this.http.post('/api/role-authorities', payload).subscribe(() => {
        this.fetchAll();
        this.reset();
      });
    }
  }

  edit(item: RoleAuthority) {
    this.newRelation = { ...item };
    this.selectedId = item.id!;
  }

  delete(id: number) {
    this.http.delete(`/api/role-authorities/${id}`).subscribe(() => {
      this.fetchAll();
    });
  }

  reset() {
    this.newRelation = { roleName: '', authorityName: '' };
    this.selectedId = null;
  }
}
