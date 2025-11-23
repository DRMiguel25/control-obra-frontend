import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginPageComponent } from './features/auth/pages/login-page/login-page.component';
import { RegisterPageComponent } from './features/auth/pages/register-page/register-page.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    data: { animation: 'LoginPage' }
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    data: { animation: 'RegisterPage' }
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },

  // Redirigir a home por defecto si está autenticado
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Ruta para proyectos (incluye listado, creación y dashboard)
  {
    path: 'proyectos',
    canActivate: [authGuard],
    loadChildren: () => import('./features/proyectos/pages/proyectos.routes')
      .then(m => m.PROYECTOS_ROUTES),
  },
  // Ruta comodín (si no encuentra ninguna)
  { path: '**', redirectTo: 'proyectos' }
];