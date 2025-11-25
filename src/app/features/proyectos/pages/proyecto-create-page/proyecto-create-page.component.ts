import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ObraService } from '../../../../shared/services/obra.service';
import { ProyectoCreateDTO } from '../../../../shared/interfaces/domain-models';
import { AuthService } from '../../../../core/services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-proyecto-create-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './proyecto-create-page.component.html',
  // styleUrls: ['./proyecto-create-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProyectoCreatePageComponent {
  private obraService = inject(ObraService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Estado del formulario
  public proyectoDTO: ProyectoCreateDTO = {
    nombreObra: '',
    ubicacion: '',
    fechaInicio: new Date(),
    UserId: 0, // Will be populated from JWT token
  };

  public isSaving = signal(false);
  public errorMessage = signal<string | null>(null);

  onSubmit(form: any): void {
    if (form.invalid) return;

    // Get userId from JWT token
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.errorMessage.set('No se pudo obtener el ID de usuario. Por favor, inicie sesión nuevamente.');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);

    // El back-end espera un formato de fecha válido y UserId como número
    // También parece requerir el objeto User completo por validación de Entity Framework
    const currentUser = this.authService.getCurrentUser();

    const payload: ProyectoCreateDTO = {
      ...this.proyectoDTO,
      fechaInicio: new Date(this.proyectoDTO.fechaInicio),
      UserId: Number(userId)
    };

    console.log('Enviando payload:', payload);

    this.obraService.postProyecto(payload).subscribe({
      next: (newProyecto) => {
        // Redirigir al dashboard del proyecto recién creado (ej: /proyectos/10/dashboard)
        // El back-end devuelve newProyecto.proyectoID
        this.router.navigate(['/proyectos', newProyecto.proyectoID, 'dashboard']);
      },
      error: (err) => {
        this.isSaving.set(false);
        console.error('Error detallado:', err);

        let errorMsg = 'Fallo al crear el proyecto.';
        if (err.error && err.error.errors) {
          // Extraer errores de validación específicos
          const validationErrors = Object.values(err.error.errors).flat().join(', ');
          errorMsg += ` Detalles: ${validationErrors}`;
        } else if (err.error && typeof err.error === 'string') {
          errorMsg += ` ${err.error}`;
        } else if (err.message) {
          errorMsg += ` ${err.message}`;
        }

        this.errorMessage.set(errorMsg);
      },
    });
  }
}