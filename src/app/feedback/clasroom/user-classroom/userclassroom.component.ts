import { Component, OnInit } from '@angular/core';
import {ClassroomUser} from "./queryModel/ClassroomUser";
import {ClassroomUserService} from "./service/service";
import {ClassroomService} from "../../component/Teacher/service/classroom.service";
import {debounceTime, switchMap} from "rxjs";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-classroom-user',
  templateUrl: './userclassroom.componnet.html'
})
export class UserclassroomComponent implements OnInit {
  classroomUsers: ClassroomUser[] = [];
  formData: ClassroomUser = { classroomId: 0, userId: 0 };

  constructor(private classroomService: ClassroomService,private classroomUserService: ClassroomUserService) {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => this.classroomService.searchClassrooms({ name: value }))
      )
      .subscribe(data => {
        this.classrooms = data;
      });
  }



  ngOnInit() {
    this.loadUsers();
  }
  searchControl = new FormControl('');
  classrooms: { id: number; name: string }[] = [];
  selectedClassroomId: number | null = null;


  onClassroomSelect(value: any) {
    // Gelen value string olduğu için number'a çeviriyoruz
    this.selectedClassroomId = Number(value);
    console.log('Seçilen classroom ID:', this.selectedClassroomId);
  }

  loadUsers() {
    this.classroomUserService.getAll().subscribe(users => {
      this.classroomUsers = users;
    });
  }

  onSubmit() {
    console.log(this.formData)
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
