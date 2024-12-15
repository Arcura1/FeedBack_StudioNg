import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-popup-teacher',
  templateUrl: './popupteacher.component.html',
  styleUrls: ['./popupteacher.component.css'],
})


export class PopupTeacherComponent {
  @Input() homework: any; // Homework passed from parent (initial empty)
  isVisible: boolean = false; // To control visibility of the popup
  userList: any[] = []; // To store user details for the homework

  constructor(private http: HttpClient, private router: Router) {}

  openPopup(homework: any): void {
    this.homework = homework; // Assign the homework object (with id)
    this.isVisible = true; // Show the popup
    this.fetchUsersForHomework(this.homework.id); // Fetch user details for the given homework ID
  }
  goToPdfEdit() {
    this.router.navigate(['/feedback/PdfEdit']);
  }

  fetchUsersForHomework(homeworkId: string): void {
    const apiUrl = `http://localhost:8080/pdf/findByH/${homeworkId}`;
    this.http.get<any>(apiUrl).subscribe(
      (response) => {
        console.log('API Response:', response); // Log the response
        this.userList = response; // Directly assign the response to userList
        console.log('User List:', this.userList);
      },
      (error) => {
        console.error('Error fetching user details:', error);
        alert('Kullanıcı bilgileri alınamadı.');
      }
    );
  }

  closePopup(): void {
    this.isVisible = false; // Hide the popup
    this.userList = []; // Clear the user list when closing
  }
}
