import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [NgIf, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.scss',
    '../../../../styles/shared/_button-style.shared.scss',
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

  constructor(private authService: AuthService) {}

  registerUser(): void {
    this.authService.register(this.userRegisterObj).subscribe({
      next: (res) => {
        this.isLoginView = true;
      },
      error: (err) => {
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
        },
        error: (err) => {
          this.errorMsg = 'Error when trying to log in';
        },
      });
  }
}
