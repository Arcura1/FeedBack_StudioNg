import { Component, OnInit } from '@angular/core';
import { ClassroomUser } from "./queryModel/ClassroomUser";
import { ClassroomUserService } from "./service/service";
import { ClassroomService } from "../../component/Teacher/service/classroom.service";
import {debounceTime, Subject, switchMap} from "rxjs";
import { FormControl } from "@angular/forms";
import {HttpClient} from "@angular/common/http";

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


  constructor(private http: HttpClient,
    private classroomService: ClassroomService,
    private classroomUserService: ClassroomUserService
  ) {

    this.searchSubject.pipe(debounceTime(300)).subscribe(searchText => {
      console.log(searchText)
      this.searchUsers(searchText);
    });
  }

  onSearchChange() {
    this.searchSubject.next(this.searchText);
  }

  searchUsers(query: string) {
    const body = {
      firstName: query,
    };

    console.log(body)
    console.log(query)

    this.http.post<any[]>('http://localhost:8080/api/users/search', body).subscribe(users => {
      console.log(users)
      this.filteredUsers = users;
    });
  }

  onUserSelect(user: any) {
    this.selectedUserId = user.id;
    this.filteredUsers = [];
    this.formData.userId=user.id;

    this.searchText = `${user.firstName} ${user.lastName}`;
    console.log('Seçilen Kullanıcı ID:', this.selectedUserId);
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

  onSubmit() {
    if (this.formData.id) {
      this.classroomUserService.update(this.formData.id, this.formData).subscribe(() => {
        this.loadUsers();
        this.resetForm();
      });
    } else {
      this.classroomUserService.create(this.formData).subscribe(() => {
        this.loadUsers();
        this.resetForm();
      });
    }
  }

  editUser(user: ClassroomUser) {
    this.formData = { ...user };
  }

  deleteUser(id: number | undefined) {
    if (id) {
      this.classroomUserService.delete(id).subscribe(() => this.loadUsers());
    }
  }

  resetForm() {
    this.formData = { classroomId: 0, userId: 0 };
  }
}
