import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstimacionCosto } from '../../../../shared/interfaces/domain-models';
import { ObraService } from '../../../../shared/services/obra.service';

@Component({
  selector: 'app-edit-estimacion-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-estimacion-modal.component.html',
  // ELIMINADA: styleUrls: ['./edit-estimacion-modal.component.css'], 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditEstimacionModalComponent {
  private obraService = inject(ObraService);

  @Input({ required: true }) estimacion!: EstimacionCosto;
  
  @Output() estimacionActualizada = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>(); 

  public conceptoDraft: string = '';
  public montoDraft: number = 0;
  
  public isSaving = signal<boolean>(false);
  public concurrencyError = signal<string | null>(null);
  public validationError = signal<string | null>(null);

  constructor() {
    setTimeout(() => { 
        this.conceptoDraft = this.estimacion.concepto;
        this.montoDraft = this.estimacion.montoEstimado;
    });
  }

  onSubmit(): void {
    if (this.isSaving()) return;

    this.isSaving.set(true);
    this.concurrencyError.set(null);
    this.validationError.set(null);

    const updatedEstimacion: EstimacionCosto = {
      ...this.estimacion,
      concepto: this.conceptoDraft,
      montoEstimado: this.montoDraft,
      rowVersion: this.estimacion.rowVersion 
    };

    this.obraService.putEstimacion(updatedEstimacion).subscribe({
      next: () => {
        this.estimacionActualizada.emit(); 
        this.close.emit();
      },
      error: (errorMessage: string) => {
        this.isSaving.set(false);
        if (errorMessage.startsWith('CONCURRENCIA')) {
          this.concurrencyError.set(errorMessage);
        } else {
          this.validationError.set(errorMessage);
        }
      },
    });
  }
}