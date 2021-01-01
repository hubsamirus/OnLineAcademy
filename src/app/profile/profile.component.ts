import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../_services';

@Component({
  selector: 'OLA-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  currentUser: any;

  constructor(
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(
      (x) => (this.currentUser = x)
    );
  }
  ngOnInit(): void {}
}
