import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';  // Adicione o AuthService

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [EventService]
})
export class HomeComponent implements OnInit {
  events: any[] = [];
  isLoading = false;

  constructor(private eventService: EventService, private router: Router, private authService: AuthService) { } // Adicione AuthService

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.isLoading = true;
    this.eventService.getAllEventsWithDetails().subscribe(
      events => {
        this.events = events;
        this.isLoading = false;
      },
      error => {
        console.error('Erro ao buscar eventos', error);
        this.isLoading = false;
      }
    );
  }

  navigateToCreateEvent(): void {
    this.router.navigate(['/register-event']);
  }

  viewEventDetails(eventId: number): void {
    this.router.navigate(['/event', eventId]);
  }

  deleteEvent(eventId: number, event: Event): void {
    event.stopPropagation(); // Prevent the event click handler from firing
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      this.eventService.deleteEvent(eventId).subscribe(
        () => {
          this.events = this.events.filter(event => event.id !== eventId);
          console.log('Evento excluído com sucesso');
        },
        error => {
          console.error('Erro ao excluir evento', error);
        }
      );
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // Redireciona para a página de login após logout
  }
}
