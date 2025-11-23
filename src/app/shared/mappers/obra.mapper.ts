// src/app/shared/mappers/obra.mapper.ts
import { Proyecto, EstimacionCosto, AvanceObra } from '../interfaces/domain-models';
import { ProyectoApi, EstimacionCostoApi, AvanceObraApi } from '../interfaces/api-models';

export class ObraMapper {

  private static mapAvanceObra(apiAvance: AvanceObraApi): AvanceObra {
    return {
      id: apiAvance.avanceID,
      montoEjecutado: apiAvance.montoEjecutado,
      porcentajeCompletado: apiAvance.porcentajeCompletado,
      // Conversión clave de string a Date
      fechaRegistro: new Date(apiAvance.fechaRegistro), 
      costoId: apiAvance.costoID
    };
  }

  private static mapEstimacionCosto(apiEstimacion: EstimacionCostoApi): EstimacionCosto {
    const avances = apiEstimacion.avances ? apiEstimacion.avances.map(ObraMapper.mapAvanceObra) : [];
    
    // Calcula el porcentaje de avance promedio de la estimación para mostrar en la tabla (diseño)
    const avancePromedio = avances.length > 0 
      ? avances.reduce((sum, a) => sum + a.porcentajeCompletado, 0) / avances.length
      : 0;

    return {
      id: apiEstimacion.costoID,
      concepto: apiEstimacion.concepto,
      montoEstimado: apiEstimacion.montoEstimado,
      proyectoId: apiEstimacion.proyectoID,
      rowVersion: apiEstimacion.rowVersion,
      avances: avances,
      avancePorcentaje: avancePromedio 
    };
  }

  public static mapProyecto(apiProyecto: ProyectoApi): Proyecto {
    const estimaciones = apiProyecto.estimaciones.map(ObraMapper.mapEstimacionCosto);

    return {
      id: apiProyecto.proyectoID,
      nombre: apiProyecto.nombreObra,
      ubicacion: apiProyecto.ubicacion,
      // Conversión clave de string a Date
      fechaInicio: new Date(apiProyecto.fechaInicio), 
      estimaciones: estimaciones,
    };
  }
}