import { Routes } from '@angular/router';
import { ProyectoCreatePageComponent } from './proyecto-create-page/proyecto-create-page.component';
import { ProyectosListPageComponent } from './proyectos-list-page/proyectos-list-page.component';
import { ProyectoDetailPageComponent } from './proyecto-detail-page/proyecto-detail-page.component';
import { DashboardPageComponent } from '../../dashboard/pages/dashboard-page/dashboard-page.component';
import { ReportesPageComponent } from '../../reportes/pages/reportes-page/reportes-page.component';

export const PROYECTOS_ROUTES: Routes = [
  {
    // Ruta: /proyectos - Lista todos los proyectos
    path: '',
    component: ProyectosListPageComponent,
  },
  {
    // Ruta: /proyectos/nuevo
    path: 'nuevo',
    component: ProyectoCreatePageComponent,
  },
  {
    // Ruta: /proyectos/reportes
    path: 'reportes',
    component: ReportesPageComponent,
  },
  {
    // Ruta: /proyectos/:proyectoId/detalle
    path: ':proyectoId/detalle',
    component: ProyectoDetailPageComponent,
  },
  {
    // Ruta: /proyectos/:proyectoId/dashboard
    path: ':proyectoId/dashboard',
    component: DashboardPageComponent,
  },
];