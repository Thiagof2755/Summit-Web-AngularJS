import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router'; // Importar o Router

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm!: FormGroup;

  constructor( private router: Router) {
    this.registerForm = new FormGroup({
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      ConfirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      Nome: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

  }
  submit() {
    console.log(this.registerForm.value);
  }

  navigate() {
    this.router.navigate(['/login']); // Navegar para o componente Register
  }  
}
