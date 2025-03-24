import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../login/user.service';
import { User } from '../../../login/user';

@Component({
  selector: 'app-admin-page',
  templateUrl: './adminPage.component.html'
})
export class AdminPageComponent implements OnInit {
  users: User[] = [];
  roles: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe((data: User[]) => {
      this.users = data;
    });
  }

  loadRoles(): void {
    this.userService.getAllRoles().subscribe(data => {
      this.roles = data;
    });
  }

onRoleChange(user: User, event: Event): void {
  const selectElement = event.target as HTMLSelectElement;
  const newRole = selectElement.value;

  this.userService.updateUserRole(user.id!, newRole).subscribe(updated => {
    user.role = updated.role;
  });
}

}
