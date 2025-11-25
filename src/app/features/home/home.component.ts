import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div class="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        
        <!-- Header / Hero Section -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-center text-white">
          <h1 class="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Bienvenido a EAC System
          </h1>
          <p class="text-xl md:text-2xl font-light opacity-90">
            Control de Obra Inteligente
          </p>
        </div>

        <!-- Content Section -->
        <div class="p-10 space-y-8">
          
          <!-- What is it? (CORREGIDO) -->
          <section class="text-center">
            <h2 class="text-2xl font-bold text-slate-800 mb-4">¿Qué es esta plataforma?</h2>
            <p class="text-slate-600 leading-relaxed text-lg mb-4">
              EAC System (Estimate At Completion) es una solución integral diseñada para optimizar la gestión y el control financiero de proyectos de construcción. 
              Utiliza la métrica EAC para predecir el costo final del proyecto basado en el avance real y los gastos ejecutados, lo que permite detectar y corregir desviaciones presupuestales a tiempo.
            </p>
            <p class="text-sm font-semibold text-blue-700">
              EAC es el indicador clave de rendimiento (KPI) que predice el costo total del proyecto al finalizar.
            </p>
          </section>

          <hr class="border-slate-200">

          <!-- Guía de Uso Rápida -->
          <section class="text-left space-y-6">
            <h2 class="text-2xl font-bold text-slate-800 text-center mb-6">Guía de Uso Rápida</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Crear Proyecto -->
              <div class="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
                <h3 class="font-bold text-blue-800 mb-2 flex items-center">
                  <i class="fas fa-plus-circle mr-2"></i> Crear Proyecto
                </h3>
                <p class="text-sm text-slate-700">
                  Dirígete a la sección de "Proyectos" y haz clic en el botón <strong>"Nuevo Proyecto"</strong>. 
                  Completa el formulario con el nombre, ubicación y fecha de inicio de la obra.
                </p>
              </div>

              <!-- Editar Proyecto -->
              <div class="bg-amber-50 p-5 rounded-lg border-l-4 border-amber-500">
                <h3 class="font-bold text-amber-800 mb-2 flex items-center">
                  <i class="fas fa-edit mr-2"></i> Editar Proyecto
                </h3>
                <p class="text-sm text-slate-700">
                  En el listado de proyectos, usa el botón de <strong>"Editar"</strong> (lápiz) para modificar los detalles básicos. 
                  Para actualizar el avance financiero, entra al Dashboard del proyecto.
                </p>
              </div>

              <!-- Eliminar Proyecto -->
              <div class="bg-red-50 p-5 rounded-lg border-l-4 border-red-500">
                <h3 class="font-bold text-red-800 mb-2 flex items-center">
                  <i class="fas fa-trash-alt mr-2"></i> Eliminar Proyecto
                </h3>
                <p class="text-sm text-slate-700">
                  <strong>¡Importante!</strong> Para eliminar un proyecto, primero debes eliminar todas sus <strong>estimaciones de costo</strong> asociadas. 
                  Esto es una medida de seguridad para proteger la integridad de los datos financieros.
                </p>
              </div>
            </div>
          </section>

          <hr class="border-slate-200">

          <!-- Technologies -->
          <section>
            <h2 class="text-2xl font-bold text-slate-800 mb-6 text-center">Tecnologías Utilizadas</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Frontend -->
              <div class="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-center mb-4 text-red-600">
                  <i class="fab fa-angular text-4xl"></i>
                </div>
                <h3 class="text-lg font-semibold text-center text-slate-800 mb-2">Frontend</h3>
                <p class="text-slate-600 text-center text-sm">
                  Construido con <strong>Angular</strong>, ofreciendo una experiencia de usuario rápida, reactiva y modular.
                </p>
              </div>

              <!-- Backend -->
              <div class="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-center mb-4 text-purple-600">
                  <i class="fas fa-server text-4xl"></i>
                </div>
                <h3 class="text-lg font-semibold text-center text-slate-800 mb-2">Backend</h3>
                <p class="text-slate-600 text-center text-sm">
                  Potenciado por <strong>.NET Core</strong>, asegurando un rendimiento robusto, seguridad y escalabilidad.
                </p>
              </div>

              <!-- Styling -->
              <div class="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-center mb-4 text-cyan-500">
                  <i class="fab fa-css3-alt text-4xl"></i>
                </div>
                <h3 class="text-lg font-semibold text-center text-slate-800 mb-2">Diseño</h3>
                <p class="text-slate-600 text-center text-sm">
                  Estilizado con <strong>Tailwind CSS</strong> y DaisyUI para una interfaz moderna, limpia y totalmente responsiva.
                </p>
              </div>
            </div>
          </section>

          <!-- Action Button -->
          <div class="text-center mt-8">
            <a routerLink="/proyectos/2/dashboard" class="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              <span>Ir al Dashboard</span>
              <i class="fas fa-arrow-right ml-2"></i>
            </a>
          </div>

        </div>
      </div>
      
      <footer class="mt-8 text-slate-400 text-sm">
        &copy; {{ currentYear }} EAC System. Todos los derechos reservados.
      </footer>
    </div>
  `,
  styles: []
})
export class HomeComponent {
  currentYear = new Date().getFullYear();
}