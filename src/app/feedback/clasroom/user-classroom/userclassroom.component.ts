import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClassroomUser } from './queryModel/ClassroomUser';

@Component({
  selector: 'app-classroom-user',
  templateUrl: './userclassroom.component.html',
})
export class UserClassroomComponent implements OnInit {
  PickerUser: any[] = [];     // Güncelleme için (sınıfı olan kullanıcılar)
  AllUsers: any[] = [];       // Ekleme için (tüm kullanıcılar)
  classrooms: any[] = [];

  // Arama metinleri
  userSearchText: string = '';
  classroomSearchText: string = '';
  newUserSearchText: string = '';
  newUserClassroomSearchText: string = '';

  // Filtrelenmiş listeler
  filteredUsers: any[] = [];
  filteredClassrooms: any[] = [];
  filteredNewUsers: any[] = [];
  filteredNewClassrooms: any[] = [];

  // Güncelleme için
  selectedUserId: number | null = null;
  selectedUserClassroomId: number | null = null;
  selectedClassroomUserEntityId: number | null = null;
  newClassroomId: number | null = null;
  message: string = '';

  // Ekleme için
  newUserId: number | null = null;
  newUserClassroomId: number | null = null;
  addMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsersForUpdate(); // sadece sınıfı olan kullanıcılar
    this.loadUsersForAdd();    // tüm kullanıcılar
    this.loadClassrooms();
  }

  // Güncelleme için kullanıcıları yükle (sınıfı olanlar)
  loadUsersForUpdate(): void {
    this.http.get<any[]>('http://localhost:8080/classroom-users')
      .subscribe({
        next: data => {
          this.PickerUser = data.map(item => item.user);
          this.filterUsers(); // Kullanıcıları yükledikten sonra filtrele
        },
        error: () => this.message = '❌ Kullanıcılar yüklenemedi.'
      });
  }

  // Ekleme için tüm kullanıcıları yükle
loadUsersForAdd(): void {
  const payload = {
    roleType: 'STUDENT' // Backend'te RoleTypeEnum karşılığı
  };

  this.http.post<any[]>('http://localhost:8080/api/users/search', payload)
    .subscribe({
      next: data => {
        this.AllUsers = data;
        this.filterNewUsers(); // Kullanıcıları yükledikten sonra filtrele
      },
      error: () => this.addMessage = '❌ Öğrenci kullanıcılar yüklenemedi.'
    });
}


  loadClassrooms(): void {
    this.http.get<any[]>('http://localhost:8080/classrooms')
      .subscribe({
        next: data => {
          this.classrooms = data;
          this.filterClassrooms(); // Sınıfları yükledikten sonra filtrele
          this.filterNewClassrooms(); // Sınıfları yükledikten sonra filtrele
        },
        error: () => this.message = '❌ Sınıflar yüklenemedi.'
      });
  }

  filterUsers(): void {
    if (!this.userSearchText) {
      this.filteredUsers = [...this.PickerUser];
    } else {
      this.filteredUsers = this.PickerUser.filter(user =>
        (user.firstName.toLowerCase() + ' ' + user.lastName.toLowerCase()).includes(this.userSearchText.toLowerCase())
      );
    }
    if (this.filteredUsers.length > 0) {
      this.selectedUserId = this.filteredUsers[0].id;
      this.onUserChange(); // Kullanıcı değiştiğinde sınıf bilgisini güncelle
    } else {
      this.selectedUserId = null;
      this.selectedUserClassroomId = null; // Kullanıcı yoksa sınıf bilgisi de olmamalı
    }
  }

  filterClassrooms(): void {
    if (!this.classroomSearchText) {
      this.filteredClassrooms = [...this.classrooms];
    } else {
      this.filteredClassrooms = this.classrooms.filter(c =>
        c.name.toLowerCase().includes(this.classroomSearchText.toLowerCase())
      );
    }
    if (this.filteredClassrooms.length > 0) {
      this.newClassroomId = this.filteredClassrooms[0].id;
    } else {
      this.newClassroomId = null;
    }
  }

  filterNewUsers(): void {
    if (!this.newUserSearchText) {
      this.filteredNewUsers = [...this.AllUsers];
    } else {
      this.filteredNewUsers = this.AllUsers.filter(user =>
        (user.firstName.toLowerCase() + ' ' + user.lastName.toLowerCase()).includes(this.newUserSearchText.toLowerCase())
      );
    }
    if (this.filteredNewUsers.length > 0) {
      this.newUserId = this.filteredNewUsers[0].id;
    } else {
      this.newUserId = null;
    }
  }

  filterNewClassrooms(): void {
    if (!this.newUserClassroomSearchText) {
      this.filteredNewClassrooms = [...this.classrooms];
    } else {
      this.filteredNewClassrooms = this.classrooms.filter(c =>
        c.name.toLowerCase().includes(this.newUserClassroomSearchText.toLowerCase())
      );
    }
    if (this.filteredNewClassrooms.length > 0) {
      this.newUserClassroomId = this.filteredNewClassrooms[0].id;
    } else {
      this.newUserClassroomId = null;
    }
  }

  onUserChange(): void {
    if (this.selectedUserId === null) return;

    this.http.get<ClassroomUser[]>(`http://localhost:8080/classroom-users/byUser/${this.selectedUserId}`)
      .subscribe({
        next: data => {
          if (data.length > 0) {
            this.selectedUserClassroomId = data[0].classroomId ?? null;
            this.selectedClassroomUserEntityId = data[0].id ?? null;
          } else {
            this.selectedUserClassroomId = null;
            this.selectedClassroomUserEntityId = null;
          }
        },
        error: () => {
          this.message = '❌ Kullanıcının sınıf bilgisi alınamadı.';
        }
      });
  }

  updateUserClassroom(): void {
    if (
      this.selectedUserId === null ||
      this.newClassroomId === null ||
      this.selectedClassroomUserEntityId === null
    ) {
      this.message = '⚠️ Gerekli alanlar eksik.';
      return;
    }

    const payload: ClassroomUser = {
      userId: this.selectedUserId,
      classroomId: this.newClassroomId
    };

    this.http.put(`http://localhost:8080/classroom-users/${this.selectedClassroomUserEntityId}`, payload)
      .subscribe({
        next: () => {
          this.message = '✅ Kullanıcının sınıfı başarıyla güncellendi.';
          this.loadUsersForUpdate(); // sınıfı olan kullanıcıları güncelle
        },
        error: err => {
          console.error("❌ PUT HATASI:", err);
          this.message = '❌ Güncelleme sırasında hata oluştu.';
        }
      });
  }

  addUserToClassroom(): void {
    if (this.newUserId === null || this.newUserClassroomId === null) {
      this.addMessage = '⚠️ Lütfen hem kullanıcıyı hem de sınıfı seçin.';
      return;
    }

    const payload: ClassroomUser = {
      userId: this.newUserId,
      classroomId: this.newUserClassroomId
    };

    this.http.post('http://localhost:8080/classroom-users', payload)
      .subscribe({
        next: () => {
          this.addMessage = '✅ Yeni kullanıcı başarıyla sınıfa eklendi.';
          this.newUserId = null;
          this.newUserClassroomId = null;
          this.loadUsersForUpdate(); // sınıfı olan kullanıcılar listesi de güncellenmeli
        },
        error: err => {
          console.error('❌ POST HATASI:', err);
          this.addMessage = '❌ Kullanıcı sınıfa eklenemedi.';
        }
      });
  }
}
