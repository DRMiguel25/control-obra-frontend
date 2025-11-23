import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstimacionCosto, AvanceCreateDTO } from '../../../../shared/interfaces/domain-models';
import { ObraService } from '../../../../shared/services/obra.service';

@Component({
  selector: 'app-avance-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './avance-form-modal.component.html',
  styleUrls: ['./avance-form-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvanceFormModalComponent {
  private obraService = inject(ObraService);

  @Input({ required: true }) estimacion!: EstimacionCosto;
  @Output() avanceRegistrado = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>(); 

  public avanceDTO: AvanceCreateDTO = { 
    montoEjecutado: 0, 
    porcentajeCompletado: 0, 
    costoID: 0 
  };
  
  public isSaving = signal<boolean>(false);
  public validationErrors = signal<string[]>([]);
  public generalError = signal<string | null>(null);

  constructor() {
    setTimeout(() => { 
        this.avanceDTO.costoID = this.estimacion.id;
    });
  }

  onSubmit(): void {
    if (this.isSaving()) return;

    this.isSaving.set(true);
    this.validationErrors.set([]);
    this.generalError.set(null);

    this.obraService.postAvanceObra(this.avanceDTO).subscribe({
      next: () => {
        this.avanceRegistrado.emit(); 
        this.close.emit(); 
      },
      error: (error) => {
        this.isSaving.set(false);
        if (error.status === 400 && error.error?.errors) {
          const errors = error.error.errors;
          const messages: string[] = [];
          for (const key in errors) {
            if (errors.hasOwnProperty(key)) {
              messages.push(...errors[key]);
            }
          }
          this.validationErrors.set(messages);
        } else {
          this.generalError.set('Ocurrió un error inesperado al registrar el avance.');
        }
      },
    });
  }
}