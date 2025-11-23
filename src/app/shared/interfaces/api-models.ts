
// Mapea Proyecto.cs
export interface ProyectoApi {
  proyectoID: number;
  nombreObra: string;
  ubicacion: string;
  fechaInicio: string; // string, pues la API lo envía así
  estimaciones: EstimacionCostoApi[];
}

// Mapea EstimacionCosto.cs
export interface EstimacionCostoApi {
  costoID: number;
  concepto: string;
  montoEstimado: number; 
  proyectoID: number;
  rowVersion: number[] | null; // Usado para la Concurrencia Optimista (Timestamp)
  avances: AvanceObraApi[] | null;
}

// Mapea AvanceObra.cs
export interface AvanceObraApi {
  avanceID: number;
  montoEjecutado: number;
  porcentajeCompletado: number;
  fechaRegistro: string; // string, pues la API lo envía así
  costoID: number;
}