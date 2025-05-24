import { Component, OnInit } from '@angular/core';
import {Role, RoleService} from "./roleSrevice";
import {HttpClient} from "@angular/common/http";
import {debounceTime, distinctUntilChanged, Subject, switchMap} from "rxjs";

@Component({
  selector: 'app-role-page',
  templateUrl: './rolePage.component.html',
  styleUrls: ['./rolePage.component.css']
})


export class RolePageComponent implements OnInit {
  roles: Role[] = [];

  organizations: any[] = [];
  organizationsa: any[] = [];

  newRole: Role = { name: '', description: '',organizationId: undefined, roleTypeEnum: 'CUSTOM' };
  selectedRoleId: number | null = null;
  query = {
    name: '',
    description: '',
    roleTypeEnum: '',
    organizationId:undefined,
  };
  loading = false;
  inputText$ = new Subject<string>();
  suggestions: string[] = [];
  selectedValue: string | null = null;



  roleTypes: string[] = ['ADMIN', 'EXECUTIVE', 'TEACHER', 'STUDENT', 'GUEST', 'CUSTOM'];

  constructor(private roleService: RoleService ,private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRoles();
  }
  payload = {
    name: ''
  };
  organizationText: any= "";



  payloadAdd = {
    name: ''
  };
  organizationTextAdd: any= "";

  onOrganizationChange() {
    console.log('Organizasyon seçildi:');
    // Burada organizasyon seçimi sonrası işlem yapabilirsin.
  }



  onInputChange(event: any) {
    const inputValue = event.target.value;
    console.log(event)
    if (inputValue.length >= 2) { // en az 2 karakter sonra başlasın
      this.payload.name = inputValue

      this.http.post<any[]>('http://localhost:8080/organization/search', this.payload)
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
  onInputChangeadd(event: any) {
    const inputValue = event.target.value;
    console.log(event)
    if (inputValue.length >= 2) { // en az 2 karakter sonra başlasın
      this.payload.name = inputValue

      this.http.post<any[]>('http://localhost:8080/organization/search', this.payload)
        .pipe(
          debounceTime(300), // 300ms bekler, hızlı yazınca az istek atar
          distinctUntilChanged()
        )
        .subscribe(response => {
          console.log(response)
          this.organizationsa = response;
        });
    } else {
      this.organizationsa = []; // boş inputta listeyi temizle
    }
  }
  searchRoles() {
    this.loading = true;

    const cleanedQuery = {
      name: this.query.name || null,
      description: this.query.description || null,
      roleTypeEnum: this.query.roleTypeEnum || null,
      organizationId: this.query.organizationId || null,
    };

    this.http.post<Role[]>('http://localhost:8080/roles/query', cleanedQuery).subscribe({
      next: (data:any) => {
        this.roles = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  clearFilters() {
    this.query = {
      name: '',
      description: '',
      roleTypeEnum: '',
      organizationId: undefined
    };
    this.organizationText=""
    this.organizationTextAdd=""
    this.organizations = [];
    this.organizationsa= [];
    this.roles = [];
  }


  loadRoles(): void {
    this.roleService.getRoles().subscribe(data => this.roles = data);
  }

  saveRole(): void {
    if (this.selectedRoleId) {
      this.roleService.updateRole(this.selectedRoleId, this.newRole).subscribe(() => {
        this.resetForm();
        this.loadRoles();
      });
    } else {
      this.roleService.createRole(this.newRole).subscribe(() => {
        this.resetForm();
        this.loadRoles();
      });
    }
  }

  editRole(role: Role): void {
    this.newRole = { ...role };
    this.selectedRoleId = role.id || null;

    this.http.get<any>('http://localhost:8080/organization/'+role.organizationId)
      .subscribe(response => {
        this.organizationTextAdd=response.name;
        console.log(response)
        console.log(this.organizationTextAdd)
      });


  }

  deleteRole(id: number): void {
    this.roleService.deleteRole(id).subscribe(() => this.loadRoles());
  }


  resetForm(): void {
    this.newRole = { name: '', description: '',organizationId:undefined, roleTypeEnum:"CUSTOM"};
    this.selectedRoleId = null;

    this.organizationText=""
    this.organizationTextAdd=""
    this.organizations = [];
    this.organizationsa= [];
  }
}
