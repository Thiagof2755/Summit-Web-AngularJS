import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegisterResponse } from '../types/RegisterResponse.type';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'http://localhost:3000';

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  register(email: string, password: string, name: string, confirmPassword: string): Observable<RegisterResponse> {
    const body = { email, password, name, confirmPassword };
    return this.httpClient.post<RegisterResponse>(`${this.apiUrl}/user/auth/register`, body).pipe(
      tap(response => {

        console.log('Registro bem-sucedido', response);
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        console.error('Erro no registro', error);

        this.showErrorNotification('Falha no registro. Por favor, tente novamente.');
        return throwError(error);
      })
    );
  }

  private showErrorNotification(message: string): void {

    alert(message);
  }
}
