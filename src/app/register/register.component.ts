import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService, AuthenticationService } from '../_services';
import { MustMatch } from '../_helpers/must-match.validator';

@Component({
  selector: 'OLA-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
     this.registerForm = this.formBuilder.group(
       {
         firstName: ['', Validators.required],
         lastName: ['', Validators.required],
         username: ['', Validators.required],
         email: ['', [Validators.required, Validators.email]],
         password: ['', [Validators.required, Validators.minLength(6)]],
         confirmPassword: ['', Validators.required],
       },
       {
         validator: MustMatch('password', 'confirmPassword'),
       }
     );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService
      .register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate(['/login'], {
            queryParams: { registered: true },
          });
        },
        (error) => {
          this.error = error;
          this.loading = false;
        }
      );
  }
}
