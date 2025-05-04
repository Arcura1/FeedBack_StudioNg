import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {Organization} from "../../clasroom/classroom.component";

@Component({
  selector: 'app-userPage',
  templateUrl: './userPage.component.html',
  styleUrls: ['./userPage.component.css']
})
export class UserPageComponent implements OnInit {
  roleTypes: string[] = ['ADMIN', 'EXECUTIVE', 'TEACHER', 'STUDENT', 'GUEST', 'CUSTOM'];
  organizations: any[] = [];
  users: any[] = [];

  payload = {
    name: '',
    roleTypeEnum: ''
  };
  userForm = {
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleId: 0,
    role: ''

  };
  isUpdateMode = false;


  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.fetchAllUsers();
  }
  onRoleChange(event:any) {
    console.log(event)
    this.payload.roleTypeEnum=this.userForm.role;
    this.userForm.roleId=0;
    this.http.post<any[]>('http://localhost:8080/roles/query', this.payload)
      .pipe(
        debounceTime(300), // 300ms bekler, hızlı yazınca az istek atar
        distinctUntilChanged()
      )
      .subscribe(response => {
        console.log(response)
        this.organizations = response;
      });
  }

  fetchAllUsers() {
    this.http.get<any[]>('http://localhost:8080/api/users/getAll') // Burayı kendi RoleTypeEnum'a göre değiştir
      .subscribe({
        next: data => this.users = data,
        error: err => console.error('Kullanıcılar alınamadı:', err)
      });
  }

  createUser() {
    console.log(this.userForm)
    this.http.post('http://localhost:8080/api/users/create', this.userForm)
      .subscribe({
        next: () => {
          this.fetchAllUsers();
          this.resetForm();
        },
        error: err => alert("Hata: " + err.error)
      });
  }

  onInputChange(event: any) {
    const inputValue = event.target.value;
    console.log(event)
    this.organizations=[];
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


  onOrganizationChange($event:any) {

    console.log('Organizasyon seçildi:', this.userForm.roleId);
    console.log($event.target.value);
    // Burada organizasyon seçimi sonrası işlem yapabilirsin.
    this.userForm.roleId=$event.target.value;
  }

  editUser(user: any) {
    this.userForm = {...user};
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
    this.organizations=[];
    this.userForm = {
      id: null,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      roleId: 0,
      role: ''
    };
    this.isUpdateMode = false;
  }
}
