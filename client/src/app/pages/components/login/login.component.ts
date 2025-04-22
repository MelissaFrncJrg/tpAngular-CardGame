import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [NgIf, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.scss',
    '../../../../shared/styles/_button-style.shared.scss',
  ],
  standalone: true,
})
export class LoginComponent {
  isLoginView: boolean = false;

  errorMsg?: string;

  userRegisterObj: any = {
    name: '',
    login: '',
    password: '',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) {}

  registerUser(): void {
    this.authService.register(this.userRegisterObj).subscribe({
      next: () => {
        this.isLoginView = true;
        this.errorMsg = undefined;
      },
      error: () => {
        this.errorMsg = 'Error when trying to create user';
      },
    });
  }

  userLoginObj = {
    login: '',
    password: '',
  };

  loginUser(): void {
    this.authService
      .login(this.userLoginObj.login, this.userLoginObj.password)
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.userService.token = res.token;
          this.router.navigate(['/layout/cards']);
        },
        error: () => {
          this.errorMsg = 'Error when trying to log in';
        },
      });
  }
}
