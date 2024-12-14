import {Component} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Component({  selector: 'app-test',
  templateUrl: './test.component.html'
})
export class TestComponent{
  id: string = '';
  selectedFile: File | null = null;
  formData = new FormData();
  public pdf: string= '';
  public homework: string = '';

  ngOnInit(): void {
    this.pdf = 'pdf';
    this.homework = 'homework';
  }


  constructor(private http: HttpClient) {}

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.id && this.selectedFile) {
      this.formData.append('id', this.id);
      this.formData.append('file', this.selectedFile);

      this.uploadPDF();
    } else {
      alert('Please provide both ID and file.');
    }
  }

  uploadPDF(): void {
    this.http.post('http://localhost:8080/pdf/uploadPdf', this.formData).subscribe(
      (response) => {
        console.log('Upload success:', response);
        alert('PDF uploaded successfully!');
      },
      (error) => {
        console.error('Upload error:', error);
        alert('Error uploading PDF!');
      }
    );
  }
}
