import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router'; // Importar o Router
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent
  ],
  providers: [
    LoginService
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm!: FormGroup;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  
  ){
    this.registerForm = new FormGroup({
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      ConfirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      Nome: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

  }

  submit() {
    this.loginService.login(this.registerForm.value.email, this.registerForm.value.password).subscribe({
      next: () => this.toastService.success('Cadastro efetuado com sucesso!  Aguarde o emailde nossos colaboradores!'), 
      error: () => this.toastService.error('Email ou senha inválidos!'),
    })
  }

  navigate() {
    this.router.navigate(['/login']); // Navegar para o componente Register
  }  
}

/*
{
  "imageId": 1,
  "username": "teste@teste.com",
  "profile": "profile info",
  "displayName": "Teste",
  "birthDate": "25/12/2024",
  "email": "teste@teste.com",
  "password": "senha1234"
}
*/
