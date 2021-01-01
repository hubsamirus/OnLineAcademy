import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@app/_services';
import { User, Role } from '@app/_models';

@Component({
  selector: 'OLA-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentUser: any;

  constructor(
    private router: Router,
    public authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(
      (x) => (this.currentUser = x)
    );
  }
  // tslint:disable-next-line:typedef
  ngOnInit() {}
  // tslint:disable-next-line:typedef
  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }

  // tslint:disable-next-line:typedef
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }
}
