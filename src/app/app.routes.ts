import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegisterEventComponent } from './pages/register-event/register-event.component';
import { HomeComponent } from './pages/home/home.component';
import { EventDetailComponent } from './pages/event-detail/event-detail.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'register-event',
    component: RegisterEventComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'event/:id', 
    component: EventDetailComponent,
    canActivate: [AuthGuard]
  },
];
