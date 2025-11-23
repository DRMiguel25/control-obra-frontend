module.exports = {
  content: ['./src/**/*.{html,ts}'],
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        'corporate-premium': {
          "primary": "#00509e", // Azul oscuro - confianza y profesionalismo (sidebar, menús)
          "secondary": "#2E865F", // Verde - crecimiento y éxito (KPIs positivos)
          "accent": "#ffde73", // Dorado - valor y calidad (destacados)
          "neutral": "#242c34", // Gris oscuro - textos principales
          "base-100": "#FFFFFF", // Blanco - fondo principal
          "base-200": "#F5F5F5", // Gris muy claro - tarjetas y áreas secundarias
          "base-300": "#bdc4d0", // Gris claro - bordes y divisores
          "info": "#00509e", // Azul para información
          "success": "#2E865F", // Verde para éxito
          "warning": "#FF9800", // Naranja para advertencias
          "error": "#FF0000", // Rojo para errores críticos
        },
      },
      "light",
    ],
  },
}
