// src/app/shared/interfaces/domain-models.ts

// Modelo limpio que usan los componentes
export interface Proyecto {
  id: number;
  nombre: string;
  ubicacion: string;
  fechaInicio: Date; // Usamos Date de TypeScript
  estimaciones: EstimacionCosto[];
}

// Modelo limpio de Estimación
export interface EstimacionCosto {
  id: number;
  concepto: string;
  montoEstimado: number;
  proyectoId: number;
  rowVersion?: number[] | null;
  avances: AvanceObra[];
  // Propiedad que el mapper calculará para el dashboard
  avancePorcentaje: number;
}

// Modelo limpio de Avance
export interface AvanceObra {
  id: number;
  montoEjecutado: number;
  porcentajeCompletado: number;
  fechaRegistro: Date; // Usamos Date de TypeScript
  costoId: number;
  fotos?: AvanceFoto[];
}

export interface AvanceFoto {
  id: number;
  url: string;
  orientacion: string;
  avanceObraId: number;
}

// DTO para enviar datos a POST /api/Avances
export interface AvanceCreateDTO {
  montoEjecutado: number;
  porcentajeCompletado: number;
  costoID: number;
  UserId: number; // Required for multi-user support
}

// DTO para crear una nueva estimación de costo
export interface EstimacionCreateDTO {
  concepto: string;
  montoEstimado: number;
  proyectoID: number;
  UserId: number; // Required for multi-user support
}

// DTO para crear un nuevo proyecto
export interface ProyectoCreateDTO {
  nombreObra: string;
  ubicacion: string;
  fechaInicio: Date;
  UserId: number; // Required for multi-user support
}

// DTO para actualizar un proyecto existente
export interface ProyectoUpdateDTO {
  proyectoID: number;
  nombreObra: string;
  ubicacion: string;
  fechaInicio: Date;
}

// DTOs para PATCH (actualización parcial)
export interface ProyectoPatchDTO {
  proyectoID: number;
  nombreObra?: string;
  ubicacion?: string;
  fechaInicio?: Date;
}

export interface EstimacionPatchDTO {
  costoID: number;
  concepto?: string;
  montoEstimado?: number;
  rowVersion?: number[] | null;
}

export interface AvancePatchDTO {
  avanceID: number;
  montoEjecutado?: number;
  porcentajeCompletado?: number;
}

// DTO para actualizar un avance completo (PUT)
export interface AvanceUpdateDTO {
  avanceID: number;
  montoEjecutado: number;
  porcentajeCompletado: number;
  costoID: number;
  fechaRegistro: Date;
}

// Modelo para la respuesta del análisis de riesgo (KPIs)
export interface ResultadoDesviacion {
  riesgoDesviacion: 'ALTO' | 'MEDIO' | 'BAJO' | 'SIN AVANCE';
  desviacionPorcentaje: number;
  costoEstimado: number;
  costoProyectadoFinal: number;
  mensaje: string;
}