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
  pdfId: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  openPopup(homework: any): void {
    this.homework = homework; // Assign the homework object (with id)
    this.isVisible = true; // Show the popup
    this.fetchUsersForHomework(this.homework.id); // Fetch user details for the given homework ID
  }

  goToPdfEdit(): void {
    console.log(this.pdfId);
    this.router.navigate(['/feedback/PdfEdit/', this.homework.id, this.pdfId]);
  }

  fetchUsersForHomework(homeworkId: string): void {
    const apiUrl = `http://localhost:8080/pdf/findByH/${homeworkId}`;
    this.http.get<any>(apiUrl).subscribe(
      (response) => {
        console.log('API Response:', response); // Log the response
        this.userList = response; // Directly assign the response to userList

        // Assign the first user's id to pdfId if response is not empty
        if (response && response.length > 0) {
          this.pdfId = response[0].id;
          console.log('PDF ID:', this.pdfId);
        }
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
