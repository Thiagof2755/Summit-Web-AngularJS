import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-event',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  providers: [
    EventService
  ],
  templateUrl: './register-event.component.html',
  styleUrls: ['./register-event.component.scss']
})
export class RegisterEventComponent {
  eventForm: FormGroup;
  bannerFile: File | null = null;
  bannerBase64: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      nameEvent: ['', [Validators.required, Validators.minLength(6)]],
      description: ['', [Validators.required, Validators.minLength(6)]],
      date: ['', Validators.required],
      time: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      rua: ['', Validators.required],
      bairro: ['', Validators.required],
      numero: ['', Validators.required],
      place: ['', Validators.required],
      complement: ['', Validators.required],
      zipCode: ['', Validators.required],
      banner: ['', Validators.required]
    });
  }

  async submit() {
    if (this.eventForm.valid && this.bannerBase64) {
      this.isLoading = true;
      const event = this.prepareEvent();
      try {
        await this.eventService.createEvent(event).toPromise();
        this.toastr.success('Evento criado com sucesso');
        this.eventForm.reset();
        this.bannerFile = null;
        this.bannerBase64 = null;
        this.router.navigate(['/home']); // Redireciona para a página inicial após sucesso
      } catch (error) {
        console.error(error);
        this.toastr.error('Erro ao criar evento. Por favor, tente novamente.');
      } finally {
        this.isLoading = false;
      }
    } else {
      this.toastr.error('Preencha todos os campos corretamente');
      this.markFormGroupTouched(this.eventForm);
    }
  }

  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpeg'];
    return validTypes.includes(file.type);
  }

  private prepareEvent() {
    const { nameEvent, description, date, time, cidade, estado, rua, bairro, numero, place, complement, zipCode } = this.eventForm.value;
    return {
      categoryid: 1,
      eventaddress: {
        street: rua,
        city: cidade,
        uf: estado,
        district: bairro,
        number: numero,
        place: place,
        complement: complement,
        zipCode: zipCode
      },
      name: nameEvent,
      initialdate: date,
      enddate: date,
      observation: description,
      status: "Active",
      images: [
        {
          file: this.bannerBase64
        }
      ]
    };
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file && this.isValidImageFile(file)) {
      this.bannerFile = file;
      this.convertFileToBase64(file);
    }
  }

  private convertFileToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.bannerBase64 = reader.result as string;
    };
    reader.onerror = (error) => {
      console.error('Erro ao converter o arquivo em base64:', error);
      this.toastr.error('Erro ao carregar o arquivo. Por favor, tente novamente.');
    };
    reader.readAsDataURL(file);
  }
}
