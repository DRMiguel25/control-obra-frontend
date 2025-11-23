import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    inject,
    signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ObraService } from '../../../../shared/services/obra.service';
import { Proyecto } from '../../../../shared/interfaces/domain-models';

@Component({
    selector: 'app-proyecto-detail-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './proyecto-detail-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProyectoDetailPageComponent implements OnInit {
    private obraService = inject(ObraService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    public proyecto = signal<Proyecto | null>(null);
    public loading = signal<boolean>(true);
    public error = signal<string | null>(null);

    ngOnInit(): void {
        const proyectoId = Number(this.route.snapshot.paramMap.get('proyectoId'));
        if (proyectoId) {
            this.cargarProyectoDetalle(proyectoId);
        }
    }

    cargarProyectoDetalle(proyectoId: number): void {
        this.loading.set(true);
        this.error.set(null);

        this.obraService.getProyectoDetalle(proyectoId).subscribe({
            next: (data: Proyecto) => {
                this.proyecto.set(data);
                this.loading.set(false);
            },
            error: () => {
                this.error.set('Error al cargar el detalle del proyecto.');
                this.loading.set(false);
            },
        });
    }

    navegarADashboard(): void {
        const id = this.proyecto()?.id;
        if (id) {
            this.router.navigate(['/proyectos', id, 'dashboard']);
        }
    }

    navegarALista(): void {
        this.router.navigate(['/proyectos']);
    }

    calcularTotalEstimado(): number {
        const estimaciones = this.proyecto()?.estimaciones || [];
        return estimaciones.reduce((sum: number, est) => sum + est.montoEstimado, 0);
    }

    calcularTotalEjecutado(estimacionId: number): number {
        const estimacion = this.proyecto()?.estimaciones.find(e => e.id === estimacionId);
        if (!estimacion) return 0;
        return estimacion.avances.reduce((sum: number, av) => sum + av.montoEjecutado, 0);
    }
}
