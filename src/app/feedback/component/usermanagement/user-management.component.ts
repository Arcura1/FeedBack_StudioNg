import { Component, OnInit } from '@angular/core';
import { UserService } from '../../login/user.service';
import { User } from '../login/user';

@Component({
  selector: 'app-usermanagement',
  standalone: true,
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.css']
})
export class UsermanagementComponent implements OnInit {
  users: User[] = [];
  roles: string[] = ['Admin', 'User', 'Manager']; // Sabit roller listesi (API'den alınabilir)
  selectedRole: string = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  updateRole(user: User, newRole: string) {
    this.userService.updateUserRole(user.id, newRole).subscribe(updatedUser => {
      user.role = updatedUser.role; // Güncellenmiş rolü kullanıcı objesine yansıtıyoruz
      alert('Rol başarıyla güncellendi!');
    }, error => {
      console.error('Rol güncellenirken hata oluştu:', error);
      alert('Rol güncellenirken bir hata oluştu!');
    });
  }
}
