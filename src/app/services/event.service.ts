import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://3.97.199.173:8080/summit';

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  // Função para criar evento
  createEvent(event: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/event`, event).pipe(
      tap(response => {
        console.log('Evento criado com sucesso', response);
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        console.error('Erro ao criar evento', error);
        this.showErrorNotification('Falha ao criar evento. Por favor, tente novamente.');
        return throwError(error);
      })
    );
  }

  // Função para mostrar notificação de erro
  private showErrorNotification(message: string): void {
    alert(message);
  }

  // Nova função para obter todos os eventos com detalhes
  getAllEventsWithDetails(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}/event`).pipe(
      switchMap(events => {
        if (!events || events.length === 0) {
          return of([]);
        }
        const detailedEvents$ = events.map(event => 
          this.getEventDetails(event.id).pipe(
            map(details => ({ ...event, ...details }))
          )
        );
        return forkJoin(detailedEvents$);
      }),
      catchError(error => {
        console.error('Erro ao buscar eventos', error);
        return of([]);
      })
    );
  }

  // Função para obter detalhes de um evento pelo ID
  getEventDetails(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/event/${id}`).pipe(
      catchError(error => {
        console.error(`Erro ao buscar detalhes do evento com ID ${id}`, error);
        return of(null);
      })
    );
  }

deleteEvent(eventId: number): Observable<any> {
  return this.httpClient.delete<any>(`${this.apiUrl}/event/${eventId}`).pipe(
    tap(response => {
      console.log('Evento excluído com sucesso', response);
    }),
    catchError(error => {
      console.error('Erro ao excluir evento', error);
      return throwError(error);
    })
  );
}

}
