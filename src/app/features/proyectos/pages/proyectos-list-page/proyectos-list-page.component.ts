import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ObraService } from '../../../../shared/services/obra.service';
import { Proyecto } from '../../../../shared/interfaces/domain-models';

@Component({
    selector: 'app-proyectos-list-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './proyectos-list-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProyectosListPageComponent implements OnInit {
    private obraService = inject(ObraService);
    private router = inject(Router);

    public proyectos = signal<Proyecto[]>([]);
    public loading = signal<boolean>(true);
    public error = signal<string | null>(null);

    // Modal de confirmación de eliminación
    public isDeleteModalOpen = signal<boolean>(false);
    public proyectoToDelete = signal<Proyecto | null>(null);
    public deleteError = signal<string | null>(null);

    ngOnInit(): void {
        this.cargarProyectos();
    }

    cargarProyectos(): void {
        this.loading.set(true);
        this.error.set(null);

        this.obraService.getAllProyectos().subscribe({
            next: (data: Proyecto[]) => {
                this.proyectos.set(data);
                this.loading.set(false);
            },
            error: (err: any) => {
                this.error.set('Error al cargar los proyectos. Verifica la conexión con el backend.');
                this.loading.set(false);
            },
        });
    }

    navegarADashboard(proyectoId: number): void {
        this.router.navigate(['/proyectos', proyectoId, 'dashboard']);
    }

    navegarADetalle(proyectoId: number): void {
        this.router.navigate(['/proyectos', proyectoId, 'detalle']);
    }

    navegarANuevoProyecto(): void {
        this.router.navigate(['/proyectos/nuevo']);
    }

    // Abrir modal de confirmación
    handleEliminarProyecto(proyecto: Proyecto): void {
        this.proyectoToDelete.set(proyecto);
        this.deleteError.set(null);
        this.isDeleteModalOpen.set(true);
    }

    // Confirmar eliminación
    confirmarEliminacion(): void {
        const proyecto = this.proyectoToDelete();
        if (!proyecto) return;

        this.obraService.deleteProyecto(proyecto.id).subscribe({
            next: () => {
                // Cerrar modal y recargar lista
                this.isDeleteModalOpen.set(false);
                this.proyectoToDelete.set(null);
                this.cargarProyectos();
            },
            error: (err: any) => {
                // Mostrar error en el modal (integridad referencial)
                console.error('Error deleting project:', err);
                if (typeof err === 'string') {
                    this.deleteError.set(err);
                } else if (err?.message) {
                    this.deleteError.set(err.message);
                } else {
                    this.deleteError.set(`
                        <div class="text-left">
                            <p class="font-bold mb-2">No se puede eliminar el proyecto porque tiene estimaciones asociadas.</p>
                            <p class="mb-2">Para eliminarlo correctamente:</p>
                            <ol class="list-decimal list-inside space-y-1 ml-1">
                                <li>Ve al <strong>Dashboard</strong> del proyecto.</li>
                                <li>Elimina todas las <strong>Estimaciones de Costo</strong> de la tabla.</li>
                                <li>Regresa aquí y elimina el proyecto.</li>
                            </ol>
                        </div>
                    `);
                }
            },
        });
    }

    // Cancelar eliminación
    cancelarEliminacion(): void {
        this.isDeleteModalOpen.set(false);
        this.proyectoToDelete.set(null);
        this.deleteError.set(null);
    }
}

