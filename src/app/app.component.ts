import { Component } from '@angular/core';
import { AuthenticationService } from './_services';
import { Router } from '@angular/router';

@Component({
  selector: 'OLA-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'onLineAcademy';

  currentUser: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(
      (x) => (this.currentUser = x)
    );
  }

  // tslint:disable-next-line:typedef
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
