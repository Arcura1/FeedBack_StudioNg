import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-userManagement',
  templateUrl: './UserManagment.component.html',
  styleUrls: ['./UserManagment.component.css']
})
export class UserManagementComponent implements OnInit {


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
  }

}
