import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstimacionCosto } from '../../../../shared/interfaces/domain-models';
import { ObraService } from '../../../../shared/services/obra.service';

@Component({
  selector: 'app-confirm-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-delete-modal.component.html',
  // REMOVIDA: styleUrls: ['./confirm-delete-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDeleteModalComponent {
  private obraService = inject(ObraService);

  @Input({ required: true }) estimacion!: EstimacionCosto;
  @Output() estimacionEliminada = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>(); 

  public isDeleting = signal<boolean>(false);
  public integrityError = signal<any>(null); 

  onConfirmDelete(): void {
    if (this.isDeleting()) return;

    this.isDeleting.set(true);
    this.integrityError.set(null);

    this.obraService.deleteEstimacion(this.estimacion.id).subscribe({
      next: () => {
        this.estimacionEliminada.emit();
        this.close.emit();
      },
      error: (errorObject) => {
        this.isDeleting.set(false);
        this.integrityError.set(errorObject);
      },
    });
  }
}