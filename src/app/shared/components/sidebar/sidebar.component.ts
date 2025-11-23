import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-10 transition-all duration-300"
           [class.expanded]="isExpanded()">
      <!-- Logo / Título -->
      <div class="logo-container p-6 border-b border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors duration-200" 
           routerLink="/home"
           (mouseenter)="setExpanded(true)"
           (mouseleave)="setExpanded(false)">
        <div class="flex items-center gap-3">
          <i class="fas fa-hard-hat text-2xl flex-shrink-0"></i>
          <div class="logo-text opacity-0 transition-opacity duration-300">
            <h1 class="text-xl font-bold tracking-wider whitespace-nowrap">EAC System</h1>
            <p class="text-xs text-slate-400 mt-1 whitespace-nowrap">Control de Obra Inteligente</p>
          </div>
        </div>
      </div>

      <!-- Menú de Navegación -->
      <nav class="flex-1 px-4 py-6 space-y-2"
           (mouseenter)="setExpanded(true)"
           (mouseleave)="setExpanded(false)">
        
        <!-- Ítem: Dashboard (Condicional - solo si estamos en un proyecto) -->
        <a 
          *ngIf="proyectoIdActual()"
          [routerLink]="['/proyectos', proyectoIdActual(), 'dashboard']" 
          routerLinkActive="bg-blue-600 text-white shadow-md"
          class="nav-link flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-white transition-all duration-200 cursor-pointer select-none"
        >
          <i class="fas fa-chart-line w-5 text-center flex-shrink-0"></i>
          <span class="nav-text font-medium whitespace-nowrap opacity-0 transition-opacity duration-300">Dashboard</span>
        </a>

        <!-- Ítem: Proyectos -->
        <a 
          routerLink="/proyectos"
          routerLinkActive="bg-blue-600 text-white shadow-md"
          [routerLinkActiveOptions]="{exact: true}"
          class="nav-link flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-white transition-all duration-200 cursor-pointer select-none"
        >
          <i class="fas fa-building w-5 text-center flex-shrink-0"></i>
          <span class="nav-text font-medium whitespace-nowrap opacity-0 transition-opacity duration-300">Proyectos</span>
        </a>

        <!-- Ítem: Nuevo Proyecto -->
        <a 
          routerLink="/proyectos/nuevo"
          routerLinkActive="bg-blue-600 text-white shadow-md"
          class="nav-link flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-white transition-all duration-200 cursor-pointer select-none"
        >
          <i class="fas fa-plus-circle w-5 text-center flex-shrink-0"></i>
          <span class="nav-text font-medium whitespace-nowrap opacity-0 transition-opacity duration-300">Nuevo Proyecto</span>
        </a>

        <!-- Ítem: Reportes -->
        <a 
          routerLink="/proyectos/reportes"
          routerLinkActive="bg-blue-600 text-white shadow-md"
          class="nav-link flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-white transition-all duration-200 cursor-pointer select-none"
        >
          <i class="fas fa-file-alt w-5 text-center flex-shrink-0"></i>
          <span class="nav-text font-medium whitespace-nowrap opacity-0 transition-opacity duration-300">Reportes</span>
        </a>
      </nav>

      <!-- Footer con Botón Cerrar Sesión -->
      <div class="p-4 border-t border-slate-800"
           (mouseenter)="setExpanded(true)"
           (mouseleave)="setExpanded(false)">
        <button 
          (click)="logout()" 
          class="logout-btn flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-600 text-white shadow-md hover:bg-red-700 hover:scale-105 transition-all duration-200 w-full"
          title="Cerrar Sesión"
        >
          <i class="fas fa-sign-out-alt flex-shrink-0"></i>
          <span class="nav-text whitespace-nowrap opacity-0 transition-opacity duration-300">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 80px;
    }

    .sidebar.expanded {
      width: 256px;
    }

    .sidebar.expanded .logo-text,
    .sidebar.expanded .nav-text {
      opacity: 1;
    }

    .sidebar:not(.expanded) .logo-text,
    .sidebar:not(.expanded) .nav-text {
      width: 0;
      overflow: hidden;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);

  public proyectoIdActual = signal<number | null>(null);
  public isExpanded = signal<boolean>(false);

  ngOnInit(): void {
    this.detectarProyectoActual();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.detectarProyectoActual();
    });
  }

  private detectarProyectoActual(): void {
    const urlSegments = this.router.url.split('/');
    const proyectosIndex = urlSegments.indexOf('proyectos');

    if (proyectosIndex !== -1 && urlSegments[proyectosIndex + 1]) {
      const posibleId = parseInt(urlSegments[proyectosIndex + 1], 10);
      if (!isNaN(posibleId)) {
        this.proyectoIdActual.set(posibleId);
      } else {
        this.proyectoIdActual.set(null);
      }
    } else {
      this.proyectoIdActual.set(null);
    }
  }

  setExpanded(expanded: boolean): void {
    this.isExpanded.set(expanded);
  }

  logout(): void {
    this.authService.logout();
  }
}