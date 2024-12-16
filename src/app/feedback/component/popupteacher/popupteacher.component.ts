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
  pdfIdMap: Map<string, string> = new Map(); // Map to store pdfId for each user

  constructor(private http: HttpClient, private router: Router) {}

  // Open the popup and fetch users for the given homework
  openPopup(homework: any): void {
    this.homework = homework;
    this.isVisible = true;
    this.fetchUsersForHomework(this.homework.id);
  }

  // Navigate to PDF Edit page with specific PDF ID and Homework ID
  goToPdfEdit(userId: string): void {
    const pdfId = this.pdfIdMap.get(userId); // Get pdfId for the specific user
    if (pdfId) {
      console.log(`Navigating to PDF Edit with PDF ID: ${pdfId} and Homework ID: ${this.homework.id}`);
      this.router.navigate(['/feedback/PdfEdit/', this.homework.id, pdfId]);
    } else {
      console.error('PDF ID not found for this user!');
      alert('Bu kullanıcı için PDF ID bulunamadı!');
    }
  }

  // Fetch user details and PDF IDs for the given homework
  fetchUsersForHomework(homeworkId: string): void {
    const apiUrl = `http://localhost:8080/pdf/findByH/${homeworkId}`;
    this.http.get<any>(apiUrl).subscribe(
      (response) => {
        console.log('API Response:', response);
        this.userList = response;

        // Populate pdfIdMap with user IDs and their corresponding pdfId
        this.userList.forEach((user: any) => {
          if (user && user.id) {
            this.pdfIdMap.set(user.user.id, user.id);
          }
        });

        console.log('PDF ID Map:', this.pdfIdMap);
      },
      (error) => {
        console.error('Error fetching user details:', error);
        alert('Kullanıcı bilgileri alınamadı.');
      }
    );
  }

  // Close the popup and reset data
  closePopup(): void {
    this.isVisible = false;
    this.userList = [];
    this.pdfIdMap.clear();
  }
}
