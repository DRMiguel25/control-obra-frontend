import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { EstimacionCosto, AvanceObra } from '../../../../shared/interfaces/domain-models';

@Component({
  selector: 'app-estimaciones-table',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './estimaciones-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstimacionesTableComponent {
  @Input() estimaciones: EstimacionCosto[] | null = [];

  // OUTPUTS: Eventos para el componente padre (Dashboard)
  @Output() editarEstimacion = new EventEmitter<EstimacionCosto>();
  @Output() registrarAvance = new EventEmitter<EstimacionCosto>();
  @Output() eliminarEstimacion = new EventEmitter<EstimacionCosto>();

  // NUEVOS OUTPUTS para avances
  @Output() editarAvance = new EventEmitter<AvanceObra>();
  @Output() eliminarAvance = new EventEmitter<AvanceObra>();

  onEditEstimacion(estimacion: EstimacionCosto): void {
    this.editarEstimacion.emit(estimacion);
  }

  onRegisterAvance(estimacion: EstimacionCosto): void {
    this.registrarAvance.emit(estimacion);
  }

  onDeleteEstimacion(estimacion: EstimacionCosto): void {
    this.eliminarEstimacion.emit(estimacion);
  }

  // NUEVOS MÉTODOS para avances
  onEditAvance(avance: AvanceObra): void {
    this.editarAvance.emit(avance);
  }

  onDeleteAvance(avance: AvanceObra): void {
    this.eliminarAvance.emit(avance);
  }
}