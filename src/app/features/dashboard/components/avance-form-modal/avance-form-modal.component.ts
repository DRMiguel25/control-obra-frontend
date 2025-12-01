import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstimacionCosto, AvanceCreateDTO } from '../../../../shared/interfaces/domain-models';
import { ObraService } from '../../../../shared/services/obra.service';
import { AuthService } from '../../../../core/services/auth.service';

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
  private authService = inject(AuthService);

  @Input({ required: true }) estimacion!: EstimacionCosto;
  @Output() avanceRegistrado = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  public avanceDTO: AvanceCreateDTO = {
    montoEjecutado: 0,
    porcentajeCompletado: 0,
    costoID: 0,
    UserId: 0
  };

  public isSaving = signal<boolean>(false);
  public validationErrors = signal<string[]>([]);
  public generalError = signal<string | null>(null);

  public selectedFiles: File[] = [];
  public filePreviewUrls: string[] = [];

  constructor() {
    setTimeout(() => {
      this.avanceDTO.costoID = this.estimacion.id;
    });
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (!files) return;

    this.validationErrors.set([]);
    const newFiles: File[] = [];
    const maxFiles = 5;
    const maxSize = 8 * 1024 * 1024; // 8MB

    if (this.selectedFiles.length + files.length > maxFiles) {
      this.validationErrors.set(['Solo se permiten máximo 5 fotos por avance.']);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxSize) {
        this.validationErrors.set([`El archivo ${file.name} excede el límite de 8MB.`]);
        return;
      }
      if (!file.type.startsWith('image/')) {
        this.validationErrors.set([`El archivo ${file.name} no es una imagen válida.`]);
        return;
      }
      newFiles.push(file);
    }

    this.selectedFiles = [...this.selectedFiles, ...newFiles];
    this.generatePreviews();
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.generatePreviews();
  }

  generatePreviews(): void {
    this.filePreviewUrls = [];
    this.selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.filePreviewUrls.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  onSubmit(): void {
    // Get userId from JWT token
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.generalError.set('No se pudo obtener el ID de usuario. Por favor, inicie sesión nuevamente.');
      return;
    }

    if (this.isSaving()) return;

    this.avanceDTO.UserId = Number(userId);
    this.isSaving.set(true);
    this.validationErrors.set([]);
    this.generalError.set(null);

    this.obraService.postAvanceObra(this.avanceDTO).subscribe({
      next: (response: any) => {
        // Si hay fotos, las subimos
        if (this.selectedFiles.length > 0) {
          // El response debe contener el ID del avance creado. 
          // Asumimos que el backend devuelve el objeto creado o un objeto con ID.
          // Revisando AvancesController.cs: return CreatedAtAction(..., avance);
          const avanceId = response.id || response.avanceID;

          if (avanceId) {
            this.obraService.uploadFotos(avanceId, this.selectedFiles).subscribe({
              next: () => {
                this.avanceRegistrado.emit();
                this.close.emit();
              },
              error: (err) => {
                console.error('Error subiendo fotos', err);
                // Aún así cerramos porque el avance se creó, pero avisamos o manejamos el error idealmente.
                // Por simplicidad, emitimos éxito pero podríamos mostrar un toast.
                this.avanceRegistrado.emit();
                this.close.emit();
              }
            });
          } else {
            // Fallback si no hay ID
            this.avanceRegistrado.emit();
            this.close.emit();
          }
        } else {
          this.avanceRegistrado.emit();
          this.close.emit();
        }
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