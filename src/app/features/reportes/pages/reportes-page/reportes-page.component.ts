import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ObraService } from '../../../../shared/services/obra.service';
import { Proyecto, ResultadoDesviacion } from '../../../../shared/interfaces/domain-models';

@Component({
    selector: 'app-reportes-page',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './reportes-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportesPageComponent implements OnInit {
    private obraService = inject(ObraService);

    public proyectos = signal<Proyecto[]>([]);
    public proyectoSeleccionado = signal<number | null>(null);
    public desviacion = signal<ResultadoDesviacion | null>(null);
    public loading = signal<boolean>(false);
    public loadingProyectos = signal<boolean>(true);
    public error = signal<string | null>(null);

    ngOnInit(): void {
        this.cargarProyectos();
    }

    cargarProyectos(): void {
        this.loadingProyectos.set(true);
        this.obraService.getAllProyectos().subscribe({
            next: (data: Proyecto[]) => {
                this.proyectos.set(data);
                this.loadingProyectos.set(false);
            },
            error: (err: any) => {
                this.error.set('Error al cargar los proyectos.');
                this.loadingProyectos.set(false);
            },
        });
    }

    onProyectoSeleccionado(proyectoId: number): void {
        this.proyectoSeleccionado.set(proyectoId);
        this.cargarAnalisisRiesgo(proyectoId);
    }

    cargarAnalisisRiesgo(proyectoId: number): void {
        this.loading.set(true);
        this.error.set(null);
        this.desviacion.set(null);

        this.obraService.getAnalisisDesviacion(proyectoId).subscribe({
            next: (data: ResultadoDesviacion) => {
                this.desviacion.set(data);
                this.loading.set(false);
            },
            error: (err: any) => {
                this.error.set('Error al cargar el análisis de riesgo.');
                this.loading.set(false);
            },
        });
    }

    getRiesgoColor(riesgo: string): string {
        switch (riesgo) {
            case 'ALTO': return 'badge-error';
            case 'MEDIO': return 'badge-warning';
            case 'BAJO': return 'badge-success';
            default: return 'badge-ghost';
        }
    }

    getRiesgoIcon(riesgo: string): string {
        switch (riesgo) {
            case 'ALTO': return '🔴';
            case 'MEDIO': return '🟡';
            case 'BAJO': return '🟢';
            default: return '⚪';
        }
    }
}
