import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { ObraService } from '../../../../shared/services/obra.service';
import { Proyecto, ResultadoDesviacion, EstimacionCosto, AvanceObra } from '../../../../shared/interfaces/domain-models';

// Importa TODOS los componentes Standalone que el Dashboard usa
import { KpiCardComponent } from '../../components/kpi-card/kpi-card.component';
import { EstimacionesTableComponent } from '../../components/estimaciones-table/estimaciones-table.component';
import { AvanceFormModalComponent } from '../../components/avance-form-modal/avance-form-modal.component';
import { EditEstimacionModalComponent } from '../../components/edit-estimacion-modal/edit-estimacion-modal.component';
import { ConfirmDeleteModalComponent } from '../../components/confirm-delete-modal/confirm-delete-modal.component';
import { AddEstimacionModalComponent } from '../../components/add-estimacion-modal/add-estimacion-modal.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    KpiCardComponent,
    EstimacionesTableComponent,
    AvanceFormModalComponent,
    EditEstimacionModalComponent,
    ConfirmDeleteModalComponent,
    AddEstimacionModalComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  private obraService = inject(ObraService);
  private route = inject(ActivatedRoute);

  // ESTADO CENTRAL (SIGNALS)
  public proyecto = signal<Proyecto | null>(null);
  public desviacion = signal<ResultadoDesviacion | null>(null);
  public loading = signal<boolean>(true);
  public error = signal<string | null>(null);

  // ESTADO PARA MODALES (4 MODALES INDEPENDIENTES + Avance Delete)
  public isAvanceModalOpen = signal<boolean>(false);
  public isEditModalOpen = signal<boolean>(false);
  public isDeleteModalOpen = signal<boolean>(false);
  public isAddEstimacionModalOpen = signal<boolean>(false);
  public selectedEstimacion = signal<EstimacionCosto | null>(null);

  // NUEVOS: para eliminar/editar avances
  public isDeleteAvanceModalOpen = signal<boolean>(false);
  public selectedAvance = signal<AvanceObra | null>(null);
  public deleteAvanceError = signal<string | null>(null);

  // LÓGICA REACTIVA (USANDO computed() para KPIs)
  public riesgoColor = computed(() => {
    const riesgo = this.desviacion()?.riesgoDesviacion;
    switch (riesgo) {
      case 'ALTO': return 'bg-red-600';
      case 'MEDIO': return 'bg-amber-500';
      case 'BAJO': return 'bg-green-600';
      default: return 'bg-gray-400';
    }
  });

  public desviacionEsPositiva = computed(() => {
    return (this.desviacion()?.desviacionPorcentaje ?? 0) > 0;
  });

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const proyectoId = +params['proyectoId'];
      this.cargarDashboard(proyectoId);
    });
  }

  cargarDashboard(proyectoId: number): void {
    this.loading.set(true);
    this.error.set(null);

    // Carga los datos de la API en paralelo
    this.obraService.getProyectoDetalle(proyectoId).subscribe({
      next: (data: Proyecto) => this.proyecto.set(data),
      error: (err: any) => {
        console.error('Error loading project:', err);
        this.error.set('No se pudo cargar la información del proyecto.');
      },
    });

    this.obraService.getAnalisisDesviacion(proyectoId).subscribe({
      next: (data: ResultadoDesviacion) => {
        this.desviacion.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading risk analysis:', err);
        this.error.set('Error al cargar el análisis de riesgo. Verifique su conexión o intente más tarde.');
        this.loading.set(false);
      },
    });
  }

  retry(): void {
    const proyectoId = this.proyecto()?.id || this.route.snapshot.params['proyectoId'];
    if (proyectoId) {
      this.cargarDashboard(+proyectoId);
    }
  }

  /**
   * HANDLERS DE INTERACCIÓN (Apertura de Modales)
   */
  handleRegistrarAvance(estimacion: EstimacionCosto): void {
    this.selectedEstimacion.set(estimacion);
    this.isAvanceModalOpen.set(true);
  }

  handleEditarEstimacion(estimacion: EstimacionCosto): void {
    this.selectedEstimacion.set(estimacion);
    this.isEditModalOpen.set(true);
  }

  handleEliminarEstimacion(estimacion: EstimacionCosto): void {
    this.selectedEstimacion.set(estimacion);
    this.isDeleteModalOpen.set(true);
  }

  handleAgregarEstimacion(): void {
    this.isAddEstimacionModalOpen.set(true);
  }

  // NUEVOS HANDLERS para avances
  handleEditarAvance(avance: AvanceObra): void {
    this.selectedAvance.set(avance);
    // TODO: Crear modal de edición de avance si es necesario
    console.log('Editar avance:', avance);
  }

  handleEliminarAvance(avance: AvanceObra): void {
    this.selectedAvance.set(avance);
    this.deleteAvanceError.set(null);
    this.isDeleteAvanceModalOpen.set(true);
  }

  confirmarEliminacionAvance(): void {
    const avance = this.selectedAvance();
    if (!avance) return;

    this.obraService.deleteAvance(avance.id).subscribe({
      next: () => {
        this.isDeleteAvanceModalOpen.set(false);
        this.selectedAvance.set(null);
        this.handleRecargaDatos();
      },
      error: (err: any) => {
        this.deleteAvanceError.set('Error al eliminar el avance. Intente nuevamente.');
        console.error('Error al eliminar avance:', err);
      },
    });
  }

  cancelarEliminacionAvance(): void {
    this.isDeleteAvanceModalOpen.set(false);
    this.selectedAvance.set(null);
    this.deleteAvanceError.set(null);
  }

  /**
   * Lógica clave de REACTIVIDAD: Se ejecuta tras cualquier POST/PUT/DELETE exitoso.
   */
  handleRecargaDatos(): void {
    const proyectoId = this.proyecto()?.id;
    if (!proyectoId) return;

    // 1. Cierra todos los modales para limpiar el estado
    this.isAvanceModalOpen.set(false);
    this.isEditModalOpen.set(false);
    this.isDeleteModalOpen.set(false);
    this.isAddEstimacionModalOpen.set(false);
    this.isDeleteAvanceModalOpen.set(false);
    this.selectedEstimacion.set(null);
    this.selectedAvance.set(null);

    // 2. Recarga el Dashboard completo (actualiza KPIs y la tabla)
    this.cargarDashboard(proyectoId);
  }
}