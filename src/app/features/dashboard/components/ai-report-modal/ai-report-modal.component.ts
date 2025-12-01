import { Component, Input, Output, EventEmitter, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeminiService } from '../../../../core/services/gemini.service';
import { Proyecto, ResultadoDesviacion } from '../../../../shared/interfaces/domain-models';

@Component({
  selector: 'app-ai-report-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <dialog class="modal modal-open">
      <div class="modal-box w-11/12 max-w-3xl bg-white">
        <h3 class="font-bold text-xl flex items-center gap-2 text-indigo-700">
           <i class="fa-solid fa-wand-magic-sparkles"></i> Análisis Inteligente de Proyecto
        </h3>
        
        <div class="py-6">
          <!-- Loading State -->
          <div *ngIf="loading()" class="w-full space-y-4 p-4">
            <div class="skeleton h-8 w-3/4 bg-slate-200"></div>
            <div class="skeleton h-4 w-full bg-slate-200"></div>
            <div class="skeleton h-4 w-full bg-slate-200"></div>
            <div class="skeleton h-4 w-5/6 bg-slate-200"></div>
            <div class="skeleton h-4 w-full bg-slate-200"></div>
            <div class="skeleton h-4 w-4/6 bg-slate-200"></div>
            <div class="flex justify-center mt-4">
              <p class="text-slate-500 animate-pulse font-medium">Analizando finanzas del proyecto con IA...</p>
            </div>
          </div>

          <!-- Error State (Dashboard Style) -->
          <div *ngIf="error()" class="alert alert-error shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 class="font-bold">Error</h3>
              <div class="text-xs">{{ error() }}</div>
            </div>
            <button class="btn btn-sm btn-ghost" (click)="retry()">Reintentar</button>
          </div>

          <!-- Report Content -->
          <div *ngIf="report()" class="prose max-w-none bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
            <div [innerHTML]="formatReport(report()!)"></div>
          </div>
        </div>

        <div class="modal-action">
          <button class="btn btn-primary" (click)="close.emit()">Cerrar</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button (click)="close.emit()">close</button>
      </form>
    </dialog>
  `
})
export class AiReportModalComponent implements OnInit {
  private geminiService = inject(GeminiService);

  @Input({ required: true }) proyecto!: Proyecto;
  @Input({ required: true }) desviacion!: ResultadoDesviacion;
  @Output() close = new EventEmitter<void>();

  loading = signal(true);
  error = signal<string | null>(null);
  report = signal<string | null>(null);

  ngOnInit() {
    this.analyze();
  }

  retry() {
    this.analyze();
  }

  analyze() {
    this.loading.set(true);
    this.error.set(null);
    this.report.set(null);

    console.log('AiReportModalComponent analyzing...');
    this.geminiService.analyzeProject(this.proyecto, this.desviacion).subscribe({
      next: (text) => {
        this.report.set(text);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Gemini API Error:', err);
        let errorMessage = 'No se pudo generar el reporte. Intenta más tarde.';

        // 1. Errores lanzados manualmente (Error)
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        // 2. Errores HTTP (HttpErrorResponse)
        else if (err.status) {
          if (err.status === 400) {
            errorMessage = 'Solicitud inválida. Verifica los datos del proyecto (ej. caracteres extraños).';
          } else if (err.status === 401 || err.status === 403) {
            errorMessage = 'Error de autorización con la IA. Contacta soporte.';
          } else if (err.status === 429) {
            errorMessage = 'Límite de uso excedido. Intenta en unos minutos.';
          } else if (err.status === 500) {
            errorMessage = 'Error del servidor de IA. Intenta más tarde.';
          }

          // Mensaje extra del backend si existe
          if (err.error?.error?.message) {
            errorMessage += ` (${err.error.error.message})`;
          }
        }

        this.error.set(errorMessage);
        this.loading.set(false);
      }
    });
  }

  formatReport(text: string): string {
    // Simple markdown-like to HTML converter for the demo
    return text
      .replace(/### Resumen Ejecutivo/g, '<h3 class="text-lg font-bold text-slate-800 mt-6 mb-3 border-b pb-1 border-slate-200"><i class="fa-solid fa-chart-simple text-blue-600"></i> Resumen Ejecutivo</h3>')
      .replace(/### Factores de Riesgo/g, '<h3 class="text-lg font-bold text-slate-800 mt-6 mb-3 border-b pb-1 border-slate-200"><i class="fa-solid fa-triangle-exclamation text-amber-500"></i> Factores de Riesgo</h3>')
      .replace(/### Recomendaciones/g, '<h3 class="text-lg font-bold text-slate-800 mt-6 mb-3 border-b pb-1 border-slate-200"><i class="fa-solid fa-lightbulb text-yellow-500"></i> Recomendaciones</h3>')
      .replace(/### (.*)/g, '<h3 class="text-lg font-bold text-slate-800 mt-6 mb-3 border-b pb-1 border-slate-200">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-900">$1</strong>')
      .replace(/- (.*)/g, '<li class="ml-4 text-slate-700 list-disc">$1</li>')
      .replace(/\n/g, '<br>');
  }
}
