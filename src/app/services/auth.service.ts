import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  isLoggedIn(): boolean {
    // Verifique se o token existe no localStorage
    return !!localStorage.getItem('token');
  }

  login(token: string): void {
    localStorage.setItem('token', token);
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
