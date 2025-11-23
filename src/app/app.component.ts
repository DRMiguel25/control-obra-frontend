import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, ChildrenOutletContexts } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { slideInAnimation } from './shared/animations/route-animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [slideInAnimation]
})
export class AppComponent {
  title = 'control-obra-frontend';
  private router = inject(Router);
  private contexts = inject(ChildrenOutletContexts);
  showSidebar = true;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      this.showSidebar = !url.includes('/login') && !url.includes('/register');
    });
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}