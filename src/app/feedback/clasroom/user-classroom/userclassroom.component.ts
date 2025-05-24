import { Component, OnInit } from '@angular/core';
import { ClassroomUser } from "./queryModel/ClassroomUser";
import { ClassroomUserService } from "./service/service";
import { ClassroomService } from "../../component/Teacher/service/classroom.service";
import { debounceTime, Subject, switchMap } from "rxjs";
import { FormControl } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-classroom-user',
  templateUrl: './userclassroom.componnet.html'
})
export class UserclassroomComponent implements OnInit {
  classroomUsers: ClassroomUser[] = [];
  formData: ClassroomUser = { classroomId: 0, userId: 0 };
  classrooms: { id: number; name: string }[] = [];
  searchControl = new FormControl('');

  searchText: string = '';
  filteredUsers: any[] = [];
  selectedUserId: number | null = null;

  private searchSubject = new Subject<string>();

  constructor(
    private http: HttpClient,
    private classroomService: ClassroomService,
    private classroomUserService: ClassroomUserService
  ) {
    this.searchSubject.pipe(debounceTime(300)).subscribe(searchText => {
      this.searchUsers(searchText);
    });
  }

  ngOnInit() {
    this.loadUsers();
    this.setupSearch();
  }

  setupSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => this.classroomService.searchClassrooms({ name: value }))
      )
      .subscribe(data => {
        this.classrooms = data;
      });
  }

  loadUsers() {
    this.classroomUserService.getAll().subscribe(users => {
      this.classroomUsers = users;
    });
  }

  onSearchChange() {
    this.searchSubject.next(this.searchText);
  }

  searchUsers(query: string) {
    const body = {
      firstName: query,
    };

    this.http.post<any[]>('http://localhost:8080/api/users/search', body).subscribe(users => {
      this.filteredUsers = users;
    });
  }

  onUserSelect(user: any) {
    this.selectedUserId = user.id;
    this.filteredUsers = [];
    this.formData.userId = user.id;
    this.searchText = `${user.firstName} ${user.lastName}`;
  }

  onSubmit() {
    // Form validasyonu
    if (!this.formData.userId || this.formData.userId === 0) {
      alert('Lütfen bir kullanıcı seçin!');
      return;
    }

    if (!this.formData.classroomId || this.formData.classroomId === 0) {
      alert('Lütfen bir sınıf seçin!');
      return;
    }

    if (this.formData.id) {
      // Güncelleme işlemi
      this.classroomUserService.update(this.formData.id, this.formData).subscribe({
        next: () => {
          alert('Kullanıcı başarıyla güncellendi!');
          this.loadUsers();
          this.resetForm();
        },
        error: (error) => {
          console.error('Güncelleme hatası:', error);
          alert('Güncelleme sırasında bir hata oluştu!');
        }
      });
    } else {
      // Yeni ekleme işlemi - Doğru endpoint kullanılacak
      this.classroomUserService.create(this.formData).subscribe({
        next: () => {
          alert('Kullanıcı sınıfa başarıyla eklendi!');
          this.loadUsers();
          this.resetForm();
        },
        error: (error) => {
          console.error('Ekleme hatası:', error);
          alert('Ekleme sırasında bir hata oluştu!');
        }
      });
    }
  }

  editUser(user: ClassroomUser) {
    this.formData = { ...user };

    // Kullanıcı bilgilerini yükle ve göster
    this.loadUserDetails(user.userId);
  }

  // Kullanıcı detaylarını yükle
  loadUserDetails(userId: number) {
    this.http.get<any>(`http://localhost:8080/api/users/${userId}`).subscribe({
      next: (user) => {
        this.searchText = `${user.firstName} ${user.lastName}`;
        this.selectedUserId = user.id;
      },
      error: (error) => {
        console.error('Kullanıcı detayları yüklenemedi:', error);
      }
    });
  }

  deleteUser(id: number | undefined) {
    if (id && confirm('Bu kullanıcıyı sınıftan çıkarmak istediğinizden emin misiniz?')) {
      this.classroomUserService.delete(id).subscribe({
        next: () => {
          alert('Kullanıcı sınıftan başarıyla çıkarıldı!');
          this.loadUsers();
        },
        error: (error) => {
          console.error('Silme hatası:', error);
          alert('Silme sırasında bir hata oluştu!');
        }
      });
    }
  }

  clearSearchText() {
    this.searchText = '';
    this.filteredUsers = [];
  }

  resetForm() {
    // Form verilerini sıfırla
    this.formData = { classroomId: 0, userId: 0 };

    // Arama alanlarını temizle
    this.searchText = '';
    this.searchControl.setValue('');

    // Listeyi temizle
    this.filteredUsers = [];
    this.selectedUserId = null;
  }
}
