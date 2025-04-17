import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface RegisterPayload {
  name: string;
  login: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:3010/api';

  constructor(private http: HttpClient) {}

  login(login: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { login, password });
  }

  register(payload: RegisterPayload): Observable<any> {
    return this.http.put(`${this.baseUrl}/profiles`, payload);
  }
}
