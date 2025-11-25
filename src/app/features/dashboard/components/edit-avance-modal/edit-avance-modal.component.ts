import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvanceObra, AvanceUpdateDTO } from '../../../../shared/interfaces/domain-models';
import { ObraService } from '../../../../shared/services/obra.service';

@Component({
    selector: 'app-edit-avance-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './edit-avance-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAvanceModalComponent implements OnInit {
    private obraService = inject(ObraService);

    @Input({ required: true }) avance!: AvanceObra;
    @Output() avanceActualizado = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();

    public avanceDTO: AvanceUpdateDTO = {
        avanceID: 0,
        montoEjecutado: 0,
        porcentajeCompletado: 0,
        costoID: 0,
        fechaRegistro: new Date()
    };

    public isSaving = signal<boolean>(false);
    public validationErrors = signal<string[]>([]);
    public generalError = signal<string | null>(null);

    ngOnInit(): void {
        // Initialize DTO with current values
        this.avanceDTO = {
            avanceID: this.avance.id,
            montoEjecutado: this.avance.montoEjecutado,
            porcentajeCompletado: this.avance.porcentajeCompletado,
            costoID: this.avance.costoId,
            fechaRegistro: this.avance.fechaRegistro
        };
    }

    onSubmit(): void {
        if (this.isSaving()) return;

        this.isSaving.set(true);
        this.validationErrors.set([]);
        this.generalError.set(null);

        this.obraService.putAvance(this.avanceDTO).subscribe({
            next: () => {
                this.avanceActualizado.emit();
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
                    this.generalError.set('Ocurrió un error inesperado al actualizar el avance.');
                }
            },
        });
    }
}
