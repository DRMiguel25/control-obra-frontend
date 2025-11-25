import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstimacionCreateDTO } from '../../../../shared/interfaces/domain-models';
import { ObraService } from '../../../../shared/services/obra.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-add-estimacion-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './add-estimacion-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEstimacionModalComponent implements OnInit {
    private obraService = inject(ObraService);
    private authService = inject(AuthService);

    @Input({ required: true }) proyectoId!: number;
    @Output() estimacionCreada = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();

    public estimacionDTO: EstimacionCreateDTO = {
        concepto: '',
        montoEstimado: 0,
        proyectoID: 0,
        UserId: 0
    };

    public isSaving = signal<boolean>(false);
    public validationErrors = signal<string[]>([]);
    public generalError = signal<string | null>(null);

    ngOnInit(): void {
        console.log('AddEstimacionModalComponent ngOnInit, proyectoId:', this.proyectoId);
        this.estimacionDTO.proyectoID = this.proyectoId;
    }

    onSubmit(): void {
        // Get userId from JWT token
        const userId = this.authService.getCurrentUserId();
        if (!userId) {
            this.generalError.set('No se pudo obtener el ID de usuario. Por favor, inicie sesión nuevamente.');
            return;
        }

        // Convert numeric fields
        this.estimacionDTO.montoEstimado = Number(this.estimacionDTO.montoEstimado);
        this.estimacionDTO.UserId = Number(userId);
        console.log('Enviando estimación DTO:', this.estimacionDTO);

        // Basic client‑side validation to avoid sending incomplete data
        const errors: string[] = [];
        if (!this.estimacionDTO.concepto?.trim()) {
            errors.push('El concepto es obligatorio.');
        }
        if (this.estimacionDTO.montoEstimado <= 0) {
            errors.push('El monto estimado debe ser mayor que cero.');
        }
        if (errors.length) {
            this.validationErrors.set(errors);
            return;
        }

        if (this.isSaving()) return;
        this.isSaving.set(true);
        this.validationErrors.set([]);
        this.generalError.set(null);

        this.obraService.postEstimacion(this.estimacionDTO).subscribe({
            next: () => {
                this.estimacionCreada.emit();
                this.close.emit();
            },
            error: (error) => {
                console.error('Error al crear estimación (detalles):', error);
                this.isSaving.set(false);
                if (error.status === 400 && error.error?.errors) {
                    const serverErrors = error.error.errors;
                    const messages: string[] = [];
                    for (const key in serverErrors) {
                        if (serverErrors.hasOwnProperty(key)) {
                            messages.push(...serverErrors[key]);
                        }
                    }
                    this.validationErrors.set(messages);
                } else {
                    this.generalError.set('Ocurrió un error inesperado al crear la estimación.');
                }
            },
        });
    }

}
