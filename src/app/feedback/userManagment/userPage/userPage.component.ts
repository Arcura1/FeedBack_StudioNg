import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-userPage',
  templateUrl: './userPage.component.html',
  styleUrls: ['./userPage.component.css']
})
export class UserPageComponent implements OnInit {
  roleTypes: string[] = ['ADMIN', 'EXECUTIVE', 'TEACHER', 'STUDENT', 'GUEST', 'CUSTOM'];

  showSuggestions = false;
  users: any[] = [];
  userForm = {
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: ''

  };
  isUpdateMode = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAllUsers();
  }

  // selectAuthority(authority: Authority): void {
  //   this.newRelation.authorityName = authority.name;
  //   this.showSuggestions = false;
  // }

  hideSuggestions(): void {
    setTimeout(() => this.showSuggestions = false, 200); // küçük timeout, tıklamaya zaman tanır
  }

  onRoleChange() {
    if (this.userForm.role !== 'CUSTOM') {
      // CUSTOM dışındaki seçimlerde özel role alanını temizle
      this.userForm.role = this.userForm.role;
    }
  }

  fetchAllUsers() {
    this.http.get<any[]>('http://localhost:8080/api/users/getAll') // Burayı kendi RoleTypeEnum'a göre değiştir
      .subscribe({
        next: data => this.users = data,
        error: err => console.error('Kullanıcılar alınamadı:', err)
      });
  }

  createUser() {
    this.http.post('http://localhost:8080/api/users/create', this.userForm)
      .subscribe({
        next: () => {
          this.fetchAllUsers();
          this.resetForm();
        },
        error: err => alert("Hata: " + err.error)
      });
  }

  editUser(user: any) {
    this.userForm = { ...user };
    this.isUpdateMode = true;
  }

  updateUser() {
    this.http.put(`http://localhost:8080/api/users/update/${this.userForm.id}`, this.userForm)
      .subscribe({
        next: () => {
          this.fetchAllUsers();
          this.resetForm();
        },
        error: err => alert("Güncelleme hatası: " + err.error)
      });
  }

  deleteUser(id: number) {
    if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;

    this.http.delete(`http://localhost:8080/api/users/${id}`)
      .subscribe({
        next: () => this.fetchAllUsers(),
        error: err => alert("Silme hatası: " + err.error)
      });
  }

  resetForm() {
    this.userForm = {
      id: null,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: ''
    };
    this.isUpdateMode = false;
  }
}
