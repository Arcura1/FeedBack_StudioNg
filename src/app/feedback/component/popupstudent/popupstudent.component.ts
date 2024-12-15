import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface ResponseData {
  setId: string;
}

@Component({
  selector: 'app-popup-student',
  templateUrl: './popupstudent.component.html',
  styleUrls: ['./popupstudent.component.css'],
})
export class PopupStudentComponent {
  @Input() homework: any; // Homework details for the popup
  isVisible: boolean = false; // Popup visibility state
  selectedFile: File | null = null; // Selected file to be uploaded
  userId: string = '';
  pdfId: string = ''; // Store the fetched PDF ID

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Retrieve user ID from sessionStorage or localStorage
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.userId = user?.id || 'Bilinmiyor'; // Default value if ID is unavailable
  }

  // Navigate to PDF Edit Page
  goToPdfEdit() {
    this.router.navigate(['/feedback/PdfEdit']);
  }

  // Open the popup with homework details and fetch the PDF ID
  openPopup(homework: any): void {
    this.homework = homework;
    this.isVisible = true;
    this.fetchPdfId(); // Fetch the PDF ID from the database
  }

  // Close the popup and reset file selection
  closePopup(): void {
    this.isVisible = false;
    this.selectedFile = null;
  }

  // Handle file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Fetch the PDF ID from the database
  fetchPdfId(): void {
    const homeworkId = this.homework?.id || ''; // Use the homework ID to fetch the PDF ID
    const url = `http://localhost:8080/pdf/getPdfId/${homeworkId}`; // Replace with your backend endpoint

    this.http.get<{ pdfId: string }>(url).subscribe(
      (response) => {
        this.pdfId = response.pdfId; // Assign the fetched PDF ID
        console.log('Fetched PDF ID:', this.pdfId);
      },
      (error) => {
        console.error('Failed to fetch PDF ID:', error);
        alert('PDF ID alınamadı!');
      }
    );
  }

  // Submit the homework with the uploaded file
  submitHomework(): void {
    if (!this.selectedFile) {
      alert('Lütfen bir dosya seçin!');
      return;
    }

    const reader = new FileReader();

    // Convert the file to Base64 format
    reader.onload = () => {
      const base64File = reader.result as string;

      // Create the payload in JSON format
      const payload = {
        title: this.homework?.title || '',
        content: this.homework?.description || '',
        xsize: 1,
        ysize: 7,
        pageSize: 1,
        homeworkId: this.homework?.id || '',
        userId: this.userId,
        pdfId: this.pdfId, // Include the fetched PDF ID
      };

      console.log('Payload to be sent:', payload);

      // Send the HTTP request
      this.http.post<ResponseData>('http://localhost:8080/pdf/addPdf', payload).subscribe(
        (response) => {
          console.log(response);
          alert('PDF başarıyla gönderildi!');
        },
        (error) => {
          console.error('Error:', error);
          alert('PDF gönderilemedi!');
        }
      );
    };

    reader.onerror = (error) => {
      console.error('Failed to read file:', error);
      alert('Dosya okunamadı!');
    };

    // Read the file
    reader.readAsDataURL(this.selectedFile);
  }
}
