import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PopupComponent } from '../popup/popup.component'; // PopupComponent'i import et

@Component({
  selector: 'adminPage',
  templateUrl: './adminPage.component.html',
  styleUrls: ['./adminPage.component.css']
})
export class AdminPageComponent implements OnInit {
  ngOnInit(): void {
  }

  goToAdmin() {

  }
}
