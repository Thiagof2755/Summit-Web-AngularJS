import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../services/event.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
  providers: [EventService]
})
export class EventDetailComponent implements OnInit {
  event: any;
  isLoading = true;
  eventId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.eventId = +idParam;
      this.fetchEventDetails(this.eventId);
    } else {
      console.error('ID do evento não encontrado na URL');
      this.isLoading = false;
    }
  }

  fetchEventDetails(eventId: number): void {
    this.eventService.getEventDetails(eventId).subscribe(
      event => {
        this.event = event;
        this.isLoading = false;
      },
      error => {
        console.error('Erro ao buscar detalhes do evento', error);
        this.isLoading = false;
      }
    );
  }
}
  