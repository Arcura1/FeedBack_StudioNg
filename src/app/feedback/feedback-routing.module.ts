import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeedbackComponent } from './feedback.component';
import { ProfileComponent } from "./Profile/profle.component";
import { MainPageComponent } from "./component/mainPage/mainPage.component";
import { StudentComponent } from "./component/student/student.component";
import { PdfEditComponent } from "./component/pdfEditPage/pdfEdit.component";
import { TeacherComponent } from "./component/Teacher/teacher.component";
import { TestComponent } from "./test/test.component";
import { OrganizationComponent } from "./organization/organization.component";
import { ClassroomComponent } from "./clasroom/classroom.component";
import { UserClassroomComponent } from "./clasroom/user-classroom/userclassroom.component";
import { ExecutivePageComponent } from "./component/executive/executivePage.component";
import { executivePageQr } from "./component/executive/executiveqr/executivePageQr.component";
import { AdminPageComponent } from "./component/admin/adminPage.component";
import { GuestPageComponent } from "./component/guest/guestPage.component";
import { HomeworkComponent } from "./homework/homework.component";
import { CustomPageComponent } from './component/custom/customPage.component';
import { QrcodeComponent } from './component/qrcode/qrcode.component';
import { RoleGuard } from '../auth/role.guard';

const routes: Routes = [
  {
    path: 'PdfEdit/:homeworkId/:pdfId',
    component: PdfEditComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'EXECUTIVE', 'TEACHER', 'STUDENT', 'CUSTOM'] }
  },


  {
    path: '',
    component: MainPageComponent,
    children: [
      { path: '', component: MainPageComponent },
      { path: 'landing', component: MainPageComponent }
    ]
  },

  // 🔐 RoleGuard ile korunan rotalar (ADMIN her biri için eklendi)
  {
    path: 'teacher',
    component: TeacherComponent,
    canActivate: [RoleGuard],
    data: { roles: ['TEACHER', 'ADMIN'] }
  },
  {
    path: 'student',
    component: StudentComponent,
    canActivate: [RoleGuard],
    data: { roles: ['STUDENT', 'ADMIN'] }
  },
  {
    path: 'custom',
    component: CustomPageComponent,
    canActivate: [RoleGuard],
    data: { roles: ['CUSTOM', 'ADMIN'] }
  },
  {
    path: 'executive',
    component: ExecutivePageComponent,
    canActivate: [RoleGuard],
    data: { roles: ['EXECUTIVE', 'ADMIN'] }
  },
  {
    path: 'executivePageQr',
    component: executivePageQr,
    canActivate: [RoleGuard],
    data: { roles: ['EXECUTIVE', 'ADMIN'] }
  },
  {
    path: 'admin',
    component: AdminPageComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'usermanagement',
    component: TestComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'organization',
    component: OrganizationComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'classroom',
    component: ClassroomComponent,
    canActivate: [RoleGuard],
    data: { roles: ['EXECUTIVE', 'ADMIN'] }
  },
  {
    path: 'guestPage',
    component: GuestPageComponent,
    canActivate: [RoleGuard],
    data: { roles: ['GUEST', 'ADMIN'] }
  },

  // 🌐 Genel erişim (isteğe göre RoleGuard eklenebilir)
  { path: 'profile', component: ProfileComponent },
  {
    path: 'PdfEdit',
    component: PdfEditComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'EXECUTIVE', 'TEACHER', 'STUDENT', 'CUSTOM'] }
  },


  {
    path: 'homework/:classroomId',
    component: HomeworkComponent,
    canActivate: [RoleGuard],
    data: { roles: ['TEACHER', 'ADMIN'] }
  },

  {
    path: 'userclassroom',
    component: UserClassroomComponent,
    canActivate: [RoleGuard],
    data: { roles: ['EXECUTIVE', 'ADMIN'] }
  },

  {
    path: 'qrcode',
    component: QrcodeComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackRoutingModule { }
