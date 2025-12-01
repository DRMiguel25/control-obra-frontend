import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Proyecto, ResultadoDesviacion } from '../../shared/interfaces/domain-models';

@Injectable({
    providedIn: 'root'
})
export class GeminiService {
    private http = inject(HttpClient);
    private apiKey = 'Aqui va tu apikey';
    private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    analyzeProject(proyecto: Proyecto, desviacion: ResultadoDesviacion): Observable<string> {
        const prompt = this.generatePrompt(proyecto, desviacion);

        const body = {
            contents: [{
                parts: [{ text: prompt }]
            }]
        };

        const headers = {
            'Content-Type': 'application/json',
            'X-goog-api-key': this.apiKey
        };

        return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
            map(response => {
                // 1. Validar si la respuesta fue bloqueada por seguridad
                if (response.promptFeedback?.blockReason) {
                    throw new Error(`La IA bloqueó la solicitud por seguridad: ${response.promptFeedback.blockReason}`);
                }

                // 2. Validar si hay candidatos
                if (!response.candidates || response.candidates.length === 0) {
                    throw new Error('La IA no generó ninguna respuesta. Intenta reformular los datos del proyecto.');
                }

                // 3. Intentar extraer el texto
                try {
                    const text = response.candidates[0].content?.parts?.[0]?.text;
                    if (!text) throw new Error('Respuesta vacía.');
                    return text;
                } catch (e) {
                    console.error('Error parsing Gemini response:', e);
                    throw new Error('Error al procesar el formato de respuesta de la IA.');
                }
            })
        );
    }

    private generatePrompt(proyecto: Proyecto, desviacion: ResultadoDesviacion): string {
        const estimacionesInfo = proyecto.estimaciones && proyecto.estimaciones.length > 0
            ? proyecto.estimaciones.map(e => `- ${e.concepto}: Avance ${e.avancePorcentaje}%, Monto Estimado $${e.montoEstimado}`).join('\n')
            : 'No hay estimaciones registradas.';

        return `Actúa como un experto Analista Financiero de Construcción. Analiza el siguiente proyecto y dame un reporte breve pero perspicaz (máximo 200 palabras) sobre su salud financiera.
    
    Datos del Proyecto:
    - Nombre: ${proyecto.nombre}
    - Ubicación: ${proyecto.ubicacion}
    - Fecha Inicio: ${proyecto.fechaInicio}
    
    Estado Financiero:
    - Costo Estimado (Presupuesto): $${desviacion.costoEstimado}
    - Costo Proyectado al Final (EAC): $${desviacion.costoProyectadoFinal}
    - Desviación: ${desviacion.desviacionPorcentaje}%
    - Nivel de Riesgo: ${desviacion.riesgoDesviacion}
    
    Estimaciones (Partidas):
    ${estimacionesInfo}
    
    Formato de respuesta (Markdown):
    ### Resumen Ejecutivo
    [Tu resumen aquí]
    
    ### Factores de Riesgo
    [Puntos clave de riesgo si los hay]
    
    ### Recomendaciones
    [Acciones sugeridas]
    `;
    }
}
