import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popup-teacher',
  templateUrl: './popupteacher.component.html',
  styleUrls: ['./popupteacher.component.css'],
})
export class PopupTeacherComponent {
  @Input() homework: any; // Homework passed from parent
  isVisible: boolean = false; // To control popup visibility
  userList: any[] = []; // Store user details
  pdfIdMap: Map<string, string> = new Map(); // Map for userId -> pdfId mapping

  constructor(private http: HttpClient, private router: Router) {}

  // Open the popup and fetch user details
  openPopup(homework: any): void {
    this.homework = homework;
    this.isVisible = true;
    this.fetchUsersForHomework(this.homework.id);
  }

  // Navigate to PDF Edit page
  goToPdfEdit(userId: string): void {
    const pdfId = this.pdfIdMap.get(userId);
    if (pdfId) {
      this.router.navigate(['/feedback/PdfEdit/', this.homework.id, pdfId]);
    } else {
      alert('Bu kullanıcı için PDF ID bulunamadı!');
    }
  }

  // Fetch user details and PDF IDs
  fetchUsersForHomework(homeworkId: string): void {
    const apiUrl = `http://localhost:8080/pdf/findByH/${homeworkId}`;
    this.http.get<any>(apiUrl).subscribe(
      (response) => {
        this.userList = response;
        this.userList.forEach((user: any) => {
          if (user && user.id) {
            this.pdfIdMap.set(user.user.id, user.id);
          }
        });
      },
      (error) => {
        console.error('Error fetching user details:', error);
        alert('Kullanıcı bilgileri alınamadı.');
      }
    );
  }

  // Silme işlemi: Homework ID'yi kullanarak siler
  deleteHomework(homeworkId: string): void {
    const deleteUrl = `http://localhost:8080/Homework/del/${homeworkId}`;
    this.http.delete(deleteUrl).subscribe(
      () => {
        alert('Ödev başarıyla silindi!');
        this.closePopup();
      },
      (error) => {
        console.error('Error deleting homework:', error);
        alert('Ödev silinirken bir hata oluştu!');
      }
    );
  }

  // Close popup
  closePopup(): void {
    this.isVisible = false;
    this.userList = [];
    this.pdfIdMap.clear();
  }
}
