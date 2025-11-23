import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ObraService } from '../../../../shared/services/obra.service';
import { ProyectoCreateDTO } from '../../../../shared/interfaces/domain-models';

@Component({
  selector: 'app-proyecto-create-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './proyecto-create-page.component.html',
  // styleUrls: ['./proyecto-create-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProyectoCreatePageComponent {
  private obraService = inject(ObraService);
  private router = inject(Router);

  // Estado del formulario
  public proyectoDTO: ProyectoCreateDTO = {
    nombreObra: '',
    ubicacion: '',
    fechaInicio: new Date(),
  };

  public isSaving = signal(false);
  public errorMessage = signal<string | null>(null);

  onSubmit(form: any): void {
    if (form.invalid) return;

    this.isSaving.set(true);
    this.errorMessage.set(null);

    // El back-end espera un formato de fecha válido
    const payload: ProyectoCreateDTO = {
      ...this.proyectoDTO,
      fechaInicio: new Date(this.proyectoDTO.fechaInicio)
    };

    this.obraService.postProyecto(payload).subscribe({
      next: (newProyecto) => {
        // Redirigir al dashboard del proyecto recién creado (ej: /proyectos/10/dashboard)
        // El back-end devuelve newProyecto.proyectoID
        this.router.navigate(['/proyectos', newProyecto.proyectoID, 'dashboard']);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(`Fallo al crear el proyecto. Intente de nuevo.`);
      },
    });
  }
}