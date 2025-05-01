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
  }

  deleteRole(id: number): void {
    this.roleService.deleteRole(id).subscribe(() => this.loadRoles());
  }


  resetForm(): void {
    this.newRole = { name: '', description: '',organizationId:undefined, roleTypeEnum:"CUSTOM"};
    this.selectedRoleId = null;
  }
}
