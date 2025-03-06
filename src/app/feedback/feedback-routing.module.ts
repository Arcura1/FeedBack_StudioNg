import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FeedbackComponent} from './feedback.component';
import {ProfileComponent} from "./Profile/profle.component";
import {MainPageComponent} from "./component/mainPage/mainPage.component";
import {StudentComponent} from "./component/student/student.component";
import {PdfEditComponent} from "./component/pdfEditPage/pdfEdit.component";
import {TeacherComponent} from "./component/Teacher/teacher.component";
import {TestComponent} from "./test/test.component";
import {OrganizationComponent} from "./organization/organization.component";
import {ClassroomComponent} from "./clasroom/classroom.component";
import {ExecutivePageComponent} from "./component/executive/executivePage.component";
import {AdminPageComponent} from "./component/admin/adminPage.component";

const pageCode="feedback"
const routes: Routes = [

  {
    path: 'PdfEdit/:homeworkId/:pdfId',
    component: PdfEditComponent,
  },
  { path: '',
    component:MainPageComponent,
    children:[
      {path:'',component:MainPageComponent},
      {path:'landing',component:MainPageComponent},


    ]
  },
  {path:'teacher',component:TeacherComponent},
  {path:'profile',component:ProfileComponent},
  {path:'student',component:StudentComponent},
  {path:'PdfEdit',component:PdfEditComponent},
  {path:'test',component:TestComponent},
  {path:'organization',component:OrganizationComponent},
  {path:'classroom',component:ClassroomComponent},
  {path:'executive',component:ExecutivePageComponent},
  {path:'admin',component:AdminPageComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackRoutingModule {
}
