import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id: string;
  name: string;
  type: string;
  exp: number;
  iat: number;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private tokenKey = 'token';

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  set token(token: string | null) {
    if (token) {
      localStorage.setItem(this.tokenKey, token);
    } else {
      localStorage.removeItem(this.tokenKey);
    }
  }

  get user(): JwtPayload | null {
    const token = this.token;
    if (!token) return null;
    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
