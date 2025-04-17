import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [NgIf, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
})
export class LoginComponent {
  isLoginView: boolean = false;

  userRegisterObj: any = {
    name: '',
    login: '',
    password: '',
  };

  constructor(private authService: AuthService) {}

  registerUser(): void {
    this.authService.register(this.userRegisterObj).subscribe({
      next: (res) => {
        console.log('Profile created', res);
        this.isLoginView = true;
      },
      error: (err) => {
        console.error('Error creating profile', err);
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
          console.log('Login ok', res);
          localStorage.setItem('token', res.token);
        },
        error: (err) => {
          console.error('Error while trying to login', err);
        },
      });
  }
}
