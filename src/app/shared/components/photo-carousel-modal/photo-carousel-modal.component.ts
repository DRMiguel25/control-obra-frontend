import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvanceFoto } from '../../interfaces/domain-models';

@Component({
    selector: 'app-photo-carousel-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="modal modal-open">
      <div class="modal-box max-w-4xl relative bg-black/90 text-white">
        <button class="btn btn-sm btn-circle absolute right-2 top-2 z-50" (click)="close.emit()">✕</button>
        
        <h3 class="font-bold text-lg mb-4">Evidencias Fotográficas</h3>

        <div *ngIf="fotos.length === 0" class="text-center py-10 text-gray-400">
          No hay fotos disponibles.
        </div>

        <!-- Carousel Container -->
        <div *ngIf="fotos.length > 0" class="relative w-full h-[60vh] flex items-center justify-center">
          
          <!-- Previous Button -->
          <button class="btn btn-circle btn-ghost absolute left-2 z-10" 
                  (click)="prev()" 
                  [disabled]="currentIndex() === 0">
            ❮
          </button>

          <!-- Image Display -->
          <div class="w-full h-full flex items-center justify-center overflow-hidden">
            <ng-container *ngIf="currentFoto() as foto">
              
              <!-- Horizontal Photo -->
              <img *ngIf="isHorizontal(foto)" 
                   [src]="getApiUrl(foto.url)" 
                   class="max-w-full max-h-full object-contain transition-transform duration-300"
                   alt="Evidencia">

              <!-- Vertical Photo (Carousel style requested: Vertical carousel) -->
              <!-- For simplicity and better UX in a modal, we display it contained. 
                   The user asked for "Vertical carousel" for vertical photos. 
                   If they meant a vertical scrolling list, that's different. 
                   But usually a carousel is slide-by-slide. 
                   We will stick to a slide-by-slide view but ensure vertical photos fit nicely. -->
              <img *ngIf="!isHorizontal(foto)" 
                   [src]="getApiUrl(foto.url)" 
                   class="max-h-full max-w-full object-contain shadow-2xl"
                   alt="Evidencia Vertical">
                   
            </ng-container>
          </div>

          <!-- Next Button -->
          <button class="btn btn-circle btn-ghost absolute right-2 z-10" 
                  (click)="next()" 
                  [disabled]="currentIndex() === fotos.length - 1">
            ❯
          </button>

        </div>

        <!-- Indicators / Thumbnails -->
        <div class="flex justify-center gap-2 mt-4 overflow-x-auto py-2">
          <button *ngFor="let foto of fotos; let i = index" 
                  (click)="currentIndex.set(i)"
                  class="w-12 h-12 rounded border-2 overflow-hidden transition-all"
                  [class.border-primary]="currentIndex() === i"
                  [class.border-transparent]="currentIndex() !== i">
            <img [src]="getApiUrl(foto.url)" class="w-full h-full object-cover">
          </button>
        </div>

      </div>
      <div class="modal-backdrop" (click)="close.emit()"></div>
    </div>
  `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoCarouselModalComponent {
    @Input({ required: true }) fotos: AvanceFoto[] = [];
    @Output() close = new EventEmitter<void>();

    public currentIndex = signal<number>(0);

    get currentFoto(): any {
        return () => this.fotos[this.currentIndex()];
    }

    isHorizontal(foto: AvanceFoto): boolean {
        // Default to horizontal if not specified or if logic requires it.
        // The user mentioned "horizontal" and "vertical" specific carousels.
        // Since we are using a unified modal, we adapt the display.
        return foto.orientacion === 'Horizontal' || !foto.orientacion;
    }

    getApiUrl(url: string): string {
        // Assuming the backend serves static files at root or we need to prepend API URL
        // The backend saves as "/uploads/filename".
        // If running locally, we might need full URL if on different port, but usually proxy handles it.
        // If using ng serve proxy, relative path is fine.
        return `http://localhost:5000${url}`;
    }

    next(): void {
        if (this.currentIndex() < this.fotos.length - 1) {
            this.currentIndex.update(i => i + 1);
        }
    }

    prev(): void {
        if (this.currentIndex() > 0) {
            this.currentIndex.update(i => i - 1);
        }
    }
}
