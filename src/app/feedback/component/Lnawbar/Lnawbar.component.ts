import { Component } from '@angular/core';
import {PdfEditComponent} from "../pdfEditPage/./pdfEdit.component";

@Component({
  selector: 'Lnawbarfeed',
  templateUrl: './Lnawbar.component.html',
  styleUrls: ['./Lnawbar.component.css'],
  imports: [
    PdfEditComponent
  ],
  standalone: true
})
export class LnawbarComponent{

}
