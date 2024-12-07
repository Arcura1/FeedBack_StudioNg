import {Component, Input} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
@Component({
  selector: 'Lnawbarfeed',
  templateUrl: './Lnawbar.component.html',
  styleUrls: ['./Lnawbar.component.css'],
  imports: [
    NgClass,
    RouterLink,
    NgIf
  ],

  standalone: true
})
export class LnawbarComponent{
  @Input()  isSidebarCollapsed:boolean = true;


  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
