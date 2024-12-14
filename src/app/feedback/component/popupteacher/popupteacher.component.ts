import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-popup-teacher',
  templateUrl: './popupteacher.component.html',
  styleUrls: ['./popupteacher.component.css'],
})
export class PopupTeacherComponent {
  @Input() homework: any; // Homework passed from parent (initial empty)
  isVisible: boolean = false; // To control visibility of the popup
  submittedPdfs: any[] = []; // Submitted PDFs

  constructor(private http: HttpClient) {}

  openPopup(homework: any): void {
    this.homework = homework; // Assign the homework object (with id)
    this.isVisible = true; // Show the popup

    // Fetch homework details (including ID) from the backend if not already passed
    if (!this.homework?.id) {
      this.http.get<any>(`http://localhost:8080/Homework/getHomeworkDetails?id=${homework.id}`)
        .subscribe(
          (data) => {
            this.homework = data; // Update homework with data from the backend
            this.fetchSubmittedPdfs(); // Fetch submitted PDFs for this homework
          },
          (error) => {
            console.error('Error:', error);
            alert('Ödev bilgileri alınamadı.');
          }
        );
    } else {
      this.fetchSubmittedPdfs(); // If homework already contains the necessary details, just fetch the PDFs
    }
  }

  fetchSubmittedPdfs(): void {
    this.http
      .get<any[]>(`http://localhost:8080/Homework/getSubmittedPdfs?homeworkId=${this.homework.id}`)
      .subscribe(
        (data) => {
          this.submittedPdfs = data; // Update submitted PDFs list
        },
        (error) => {
          console.error('Error:', error);
          alert('Gönderilen PDFler alınamadı.');
        }
      );
  }

  closePopup(): void {
    this.isVisible = false; // Hide the popup
    this.submittedPdfs = []; // Clear the list of submitted PDFs
  }
}
