import { Routes } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    // Esta es la ruta que captura el ID del proyecto, ej: /proyectos/1/dashboard
    path: ':proyectoId/dashboard',
    component: DashboardPageComponent,
  },
];