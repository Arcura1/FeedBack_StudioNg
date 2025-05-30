import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { AuthorityType } from './enum/authorıtyType';
import { AuthorityTypeOptions } from './enum/AuthorityTypeOptions';

interface RoleAuthority {
  id?: number;
  roleId?: number;
  authorityId?: number;
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
interface Role {
  id: number;
  name: string;
  roleTypeEnum: string;
}

@Component({
  selector: 'app-authority-role',
  templateUrl: './authorityRole.component.html',
  styleUrls: ['./authorityRole.component.css']
})
export class AuthorityRoleComponent implements OnInit {
  roleAuthorities: RoleAuthority[] = [];
  newRelation: RoleAuthority = { roleId: undefined, authorityId: undefined };
  selectedId: number | null = null;

  authorityTypeOptions = AuthorityTypeOptions;
  selectedAuthorityType: AuthorityType | null = null;
  authoritySearchTest: string | null = null;
  filteredAuthorities: Authority[] = [];
  showSuggestions = false;

  roles: Role[] = [];

  private authoritySearchSubject = new Subject<string>();

  constructor(private http: HttpClient) {
    this.authoritySearchSubject.pipe(
      debounceTime(300),
      switchMap(text => this.fetchAuthorities(text))
    ).subscribe(data => {
      this.filteredAuthorities = data;
      this.showSuggestions = true;
    });
  }

  ngOnInit(): void {
    this.fetchAll();
  }

  // ROLE SEARCH
  onRoleSearch(event: any) {
    const inputValue = event.target.value;
    if (inputValue.length >= 2) {
      const payload = {
        name: inputValue,
        roleTypeEnum: 'CUSTOM'
      };
      this.http.post<Role[]>('http://localhost:8080/roles/query', payload)
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(response => {
          this.roles = response;
        });
    } else {
      this.roles = [];
    }
  }

  // AUTHORITY SEARCH
  onAuthorityNameChange(): void {
    const name = this.authoritySearchTest?.trim();
    if (name && name.length > 0) {
      this.authoritySearchSubject.next(name);
    } else {
      this.filteredAuthorities = [];
      this.showSuggestions = false;
    }
  }

  fetchAuthorities(name: string) {
    const body = {
      name,
      authorityType: this.selectedAuthorityType,
      effectTypeEnum: null,
      classroomId: null,
      organizationId: null
    };
    return this.http.post<Authority[]>('http://localhost:8080/authorities/query', body);
  }

  selectAuthority(authority: Authority): void {
    this.newRelation.authorityId = authority.id;
    this.showSuggestions = false;
    this.authoritySearchTest = authority.name;
  }

  hideSuggestions(): void {
    setTimeout(() => this.showSuggestions = false, 200);
  }

  selectAuthorityType(event: any) {
    this.selectedAuthorityType = event.target.value;
  }

  fetchAll() {
    this.http.get<RoleAuthority[]>('http://localhost:8080/role-authorities').subscribe(data => {
      this.roleAuthorities = data;
    });
  }

  save() {
    this.newRelation.roleId=Number(this.newRelation.roleId)
    const payload = { ...this.newRelation };
    if (this.selectedId) {
      this.http.put(`http://localhost:8080/role-authorities/${this.selectedId}`, payload).subscribe(() => {
        this.fetchAll();
        this.reset();
      });
    } else {
      this.http.post('http://localhost:8080/role-authorities', payload).subscribe(() => {
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
    this.http.delete(`http://localhost:8080/role-authorities/${id}`).subscribe(() => {
      this.fetchAll();
    });
  }

  reset() {
    this.newRelation = { roleId: undefined, authorityId: undefined };
    this.selectedId = null;
    this.authoritySearchTest = '';
    this.filteredAuthorities = [];
    this.roles = [];
  }

  selectroleType($event: Event) {
    console.log($event)
    console.log($event.target)
    console.log($event)
  }
}
