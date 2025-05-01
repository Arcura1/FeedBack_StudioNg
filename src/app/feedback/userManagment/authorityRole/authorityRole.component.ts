import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {debounceTime, distinctUntilChanged, Subject, switchMap} from "rxjs";
import {AuthorityType} from "./enum/authorıtyType";
import {AuthorityTypeOptions} from "./enum/AuthorityTypeOptions";

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
  authoritySearchTest:String| null = null;
  organizations: any[] = [];

  payload = {
    name: '',
    roleTypeEnum: 'CUSTOM'
  };
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
    const name = this.authoritySearchTest;
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
    this.newRelation.authorityId = authority.id;
    this.showSuggestions = false;
  }

  hideSuggestions(): void {
    setTimeout(() => this.showSuggestions = false, 200); // küçük timeout, tıklamaya zaman tanır
  }



  onInputChange(event: any) {
    const inputValue = event.target.value;
    console.log(event)
    if (inputValue.length >= 2) { // en az 2 karakter sonra başlasın
      this.payload.name = inputValue

      this.http.post<any[]>('http://localhost:8080/roles/query', this.payload)
        .pipe(
          debounceTime(300), // 300ms bekler, hızlı yazınca az istek atar
          distinctUntilChanged()
        )
        .subscribe(response => {
          console.log(response)
          this.organizations = response;
        });
    } else {
      this.organizations = []; // boş inputta listeyi temizle
    }
  }


  onOrganizationChange() {
    console.log('Organizasyon seçildi:', this.newRelation.roleId);
    // Burada organizasyon seçimi sonrası işlem yapabilirsin.
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
    this.newRelation = { roleId: undefined, authorityId: undefined };
    this.selectedId = null;
  }

  selectAuthorityType(event:any) {
    console.log(this.selectedAuthorityType);
    console.log(event.target.value);
    this.selectedAuthorityType=event.target.value;
    console.log(this.selectedAuthorityType);
    const temp = {
      authorityType: this.selectedAuthorityType
    }
    console.log(temp)
  }
}
