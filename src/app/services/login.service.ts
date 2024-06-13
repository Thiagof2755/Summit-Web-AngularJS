import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from './auth.service';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://3.97.199.173:8080/summit';

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }

  login(email: string, password: string) {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/login`, { username: email, password }).pipe(
      tap((response) => {
        console.log('Login realizado com sucesso', response);
        this.authService.login(response.token); // Salva o token
        this.router.navigate(['/home']);
      })
    );
  }
}
