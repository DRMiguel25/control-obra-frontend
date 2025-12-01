import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';

import {
  Proyecto,
  ResultadoDesviacion,
  AvanceCreateDTO,
  AvanceUpdateDTO,
  AvancePatchDTO,
  EstimacionCosto,
  EstimacionCreateDTO,
  EstimacionPatchDTO,
  ProyectoPatchDTO,
  AvanceObra
} from '../interfaces/domain-models';
import { ProyectoApi, EstimacionCostoApi } from '../interfaces/api-models';
import { ObraMapper } from '../mappers/obra.mapper';

@Injectable({ providedIn: 'root' })
export class ObraService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api';

  // ========================================
  // PROYECTOS
  // ========================================

  getAllProyectos(): Observable<Proyecto[]> {
    const url = `${this.apiUrl}/Proyectos`;
    return this.http.get<ProyectoApi[]>(url).pipe(
      map(proyectos => proyectos.map(ObraMapper.mapProyecto)),
      catchError(error => {
        console.error('Error al obtener la lista de proyectos:', error);
        return throwError(() => new Error('No se pudo cargar la lista de proyectos.'));
      })
    );
  }

  getProyectoDetalle(id: number): Observable<Proyecto> {
    const url = `${this.apiUrl}/Proyectos/${id}`;
    return this.http.get<ProyectoApi>(url).pipe(
      map(ObraMapper.mapProyecto),
      catchError(error => {
        console.error('Error al obtener el proyecto:', error);
        return throwError(() => new Error('No se pudo cargar el proyecto.'));
      })
    );
  }

  getAnalisisDesviacion(proyectoId: number): Observable<ResultadoDesviacion> {
    const url = `${this.apiUrl}/Proyectos/Desviacion/${proyectoId}`;
    return this.http.get<ResultadoDesviacion>(url).pipe(
      catchError(error => {
        console.error('Error al obtener la desviación:', error);
        return throwError(() => new Error('Error en el cálculo de análisis.'));
      })
    );
  }

  postProyecto(dto: any): Observable<any> {
    const url = `${this.apiUrl}/Proyectos`;
    return this.http.post(url, dto).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al crear el proyecto:', error);
        return throwError(() => error);
      })
    );
  }

  updateProyecto(proyecto: any): Observable<void> {
    const url = `${this.apiUrl}/Proyectos/${proyecto.proyectoID}`;
    return this.http.put<void>(url, proyecto).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al actualizar el proyecto:', error);
        return throwError(() => error);
      })
    );
  }

  patchProyecto(dto: ProyectoPatchDTO): Observable<void> {
    const url = `${this.apiUrl}/Proyectos/${dto.proyectoID}`;
    return this.http.patch<void>(url, dto).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al actualizar parcialmente el proyecto:', error);
        return throwError(() => error);
      })
    );
  }

  deleteProyecto(id: number): Observable<void> {
    const url = `${this.apiUrl}/Proyectos/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          // Error 400: Integridad referencial (tiene estimaciones)
          // Return the specific error message from the backend if available
          return throwError(() => error.error || 'No se puede eliminar el proyecto porque tiene registros asociados.');
        }
        return throwError(() => 'Error al eliminar el proyecto.');
      })
    );
  }

  // ========================================
  // ESTIMACIONES
  // ========================================

  postEstimacion(dto: EstimacionCreateDTO): Observable<any> {
    const url = `${this.apiUrl}/Estimaciones`;
    return this.http.post(url, dto).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al crear la estimación:', error);
        return throwError(() => error);
      })
    );
  }

  getEstimacionDetalle(id: number): Observable<EstimacionCosto> {
    const url = `${this.apiUrl}/Estimaciones/${id}`;
    return this.http.get<any>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al obtener detalle de estimación:', error);
        return throwError(() => error);
      })
    );
  }

  putEstimacion(estimacion: EstimacionCosto): Observable<void> {
    const url = `${this.apiUrl}/Estimaciones/${estimacion.id}`;
    return this.http.put<void>(url, estimacion).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) {
          return throwError(() => 'CONCURRENCIA: El registro fue modificado por otro usuario.');
        }
        return throwError(() => error);
      })
    );
  }

  patchEstimacion(dto: EstimacionPatchDTO): Observable<void> {
    const url = `${this.apiUrl}/Estimaciones/${dto.costoID}`;
    return this.http.patch<void>(url, dto).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al actualizar parcialmente la estimación:', error);
        return throwError(() => error);
      })
    );
  }

  deleteEstimacion(id: number): Observable<void> {
    const url = `${this.apiUrl}/Estimaciones/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          return throwError(() => error.error);
        }
        return throwError(() => 'Error general al intentar eliminar la estimación.');
      })
    );
  }

  // ========================================
  // AVANCES
  // ========================================

  postAvanceObra(dto: AvanceCreateDTO): Observable<any> {
    const url = `${this.apiUrl}/Avances`;
    return this.http.post(url, dto).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getAvanceDetalle(id: number): Observable<AvanceObra> {
    const url = `${this.apiUrl}/Avances/${id}`;
    return this.http.get<any>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al obtener detalle de avance:', error);
        return throwError(() => error);
      })
    );
  }

  getAvancesPorEstimacion(costoId: number): Observable<AvanceObra[]> {
    const url = `${this.apiUrl}/Avances/porEstimacion/${costoId}`;
    return this.http.get<any[]>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al obtener avances por estimación:', error);
        return throwError(() => error);
      })
    );
  }

  putAvance(dto: AvanceUpdateDTO): Observable<void> {
    const url = `${this.apiUrl}/Avances/${dto.avanceID}`;
    return this.http.put<void>(url, dto).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al actualizar el avance:', error);
        return throwError(() => error);
      })
    );
  }

  patchAvance(dto: AvancePatchDTO): Observable<void> {
    const url = `${this.apiUrl}/Avances/${dto.avanceID}`;
    return this.http.patch<void>(url, dto).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al actualizar parcialmente el avance:', error);
        return throwError(() => error);
      })
    );
  }

  deleteAvance(id: number): Observable<void> {
    const url = `${this.apiUrl}/Avances/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al eliminar el avance:', error);
        return throwError(() => 'Error al eliminar el avance.');
      })
    );
  }

  uploadFotos(avanceId: number, files: File[]): Observable<any> {
    const url = `${this.apiUrl}/Avances/${avanceId}/fotos`;
    const formData = new FormData();
    files.forEach(file => {
      formData.append('fotos', file);
    });

    return this.http.post(url, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al subir fotos:', error);
        return throwError(() => error);
      })
    );
  }
}