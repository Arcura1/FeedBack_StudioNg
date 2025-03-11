import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface Organization {
  id?: number;
  name: string;
  address: string;
  email: string;
}


export interface Classroom {
  id?: number;
  name: string;
  floor: number;
  roomNumber: string;
  capacity: number;
  hasProjector: boolean;
  hasWhiteboard: boolean;
  hasAirConditioning: boolean;
  description?: string;
  // İlişkili organization bilgisi sadece id olarak gönderilebilir
  organization?: Organization;
  organizationId?: number;
  userId?:number
}

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html'
})
export class ClassroomComponent implements OnInit {

  user: any = {}; // Kullanıcı bilgilerini saklamak için değişken
  protected PickerUser: any[] | undefined;
  classrooms: Classroom[] = [];
  organization: Organization = {name: '', address: '', email: ''};
  classroom: Classroom = {
    name: '',
    floor: 1,
    roomNumber: '',
    capacity: 0,
    hasProjector: false,
    hasWhiteboard: false,
    hasAirConditioning: false,
    description: '',
    organization: this.organization,
    organizationId:0,
    userId:this.user.id

  };
  apiUrl: string = 'http://localhost:8080/classrooms';
  organizations: any[] = [];
  selectedOrganization: string = '';

  constructor(private http: HttpClient) {
    this.user= JSON.parse(sessionStorage.getItem('user') || '{}');
  }

  ngOnInit(): void {
    this.loadClassrooms();
  }

  loadClassrooms(): void {
    this.http.get<Classroom[]>(this.apiUrl).subscribe(
      data => this.classrooms = data,
      error => {
        console.error('Classroom listesi yüklenirken hata:', error);
        alert('Classroom listesi yüklenirken hata oluştu!');
      }
    );
  }

  saveClassroom(): void {
    if (this.classroom.id) {
      // Güncelleme işlemi
      this.http.put<Classroom>(`${this.apiUrl}/${this.classroom.id}`, this.classroom)
        .subscribe(
          data => {
            alert('Classroom güncellendi.');
            this.resetForm();
            this.loadClassrooms();
          },
          error => {
            console.error('Güncelleme hatası:', error);
            alert('Classroom güncellenirken hata oluştu!');
          }
        );
    } else {
      // Oluşturma işlemi
      this.http.post<Classroom>(this.apiUrl, this.classroom)
        .subscribe(
          data => {
            alert('Classroom eklendi.');
            this.resetForm();
            this.loadClassrooms();
          },
          error => {
            console.error('Oluşturma hatası:', error);
            alert('Classroom oluşturulurken hata oluştu!');
          }
        );
    }
  }

  editClassroom(cl: Classroom): void {
    // Düzenleme için seçilen classroom bilgisini forma yükle
    this.classroom = {...cl};
  }

  deleteClassroom(id: number | undefined): void {
    if (!id) return;
    if (confirm('Bu classroom silinsin mi?')) {
      this.http.delete(`${this.apiUrl}/${id}`)
        .subscribe(
          () => {
            alert('Classroom silindi.');
            this.loadClassrooms();
          },
          error => {
            console.error('Silme hatası:', error);
            alert('Classroom silinirken hata oluştu!');
          }
        );
    }
  }

  resetForm(): void {
    this.classroom = {
      name: '',
      floor: 1,
      roomNumber: '',
      capacity: 0,
      hasProjector: false,
      hasWhiteboard: false,
      hasAirConditioning: false,
      description: '',
      organization: this.organization
    };
  }


  loadUsers() {
    this.http.get<any[]>('http://localhost:8080/api/users/type/GUEST').subscribe(
      (data) => {
        console.log(data)
        this.PickerUser = data.map(user => user);
        this.PickerUser = data
      },
      (error) => {
        console.error('Kurum tipleri yüklenirken hata oluştu:', error);
      }
    );
  }

  dropboxFiller(): void {

  }
}
