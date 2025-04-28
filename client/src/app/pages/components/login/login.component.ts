import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  imports: [NgIf, FormsModule, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.scss',
    '../../../../shared/styles/_button-style.shared.scss',
  ],
  standalone: true,
})
export class LoginComponent {
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  isLoginView: boolean = false;

  errorMsg?: string;

  userRegisterObj: any = {
    name: '',
    login: '',
    password: '',
  };

  showLoginPassword: boolean = false;
  showRegisterPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) {}

  validationErrors = {
    name: '',
    login: '',
    password: '',
  };

  registerUser(): void {
    this.validationErrors = { name: '', login: '', password: '' };
    this.errorMsg = undefined;

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{1,100}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/;
    const forbiddenCharsRegex = /(\$|\{|\}|\||;)/;

    const { name, login, password } = this.userRegisterObj;

    let hasError = false;

    if (forbiddenCharsRegex.test(name)) {
      this.validationErrors.name = $localize`:@@forbiddenCharsName:Forbidden characters detected in name.`;
      hasError = true;
    } else if (!nameRegex.test(name)) {
      this.validationErrors.name = $localize`:@@invalidName:Name must contain only letters and be under 100 characters.`;
      hasError = true;
    }

    if (forbiddenCharsRegex.test(login)) {
      this.validationErrors.login = $localize`:@@forbiddenCharsLogin:Forbidden characters detected in email.`;
      hasError = true;
    } else if (!emailRegex.test(login) || login.length > 100) {
      this.validationErrors.login = $localize`:@@invalidEmail:Invalid email format.`;
      hasError = true;
    }

    if (forbiddenCharsRegex.test(password)) {
      this.validationErrors.password = $localize`:@@forbiddenCharsPassword:Forbidden characters detected in password.`;
      hasError = true;
    } else if (password.length < 8 || password.length > 20) {
      this.validationErrors.password = $localize`:@@passwordLengthError:Password must be between 8 and 20 characters long.`;
      hasError = true;
    } else if (!passwordRegex.test(password)) {
      this.validationErrors.password = $localize`:@@invalidPassword:Password must contain one uppercase letter, one lowercase letter, and one number.`;
      hasError = true;
    }

    if (hasError) {
      return;
    }

    this.authService.register(this.userRegisterObj).subscribe({
      next: () => {
        this.isLoginView = true;
        this.errorMsg = undefined;
      },
      error: () => {
        this.errorMsg = $localize`:@@createUserError:Error when trying to create user`;
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
          this.errorMsg = $localize`:@@loginError:Error when trying to log in`;
        },
      });
  }

  toggleLoginPassword(): void {
    this.showLoginPassword = !this.showLoginPassword;
  }

  toggleRegisterPassword(): void {
    this.showRegisterPassword = !this.showRegisterPassword;
  }
}
