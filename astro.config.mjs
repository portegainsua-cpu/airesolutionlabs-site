// Configuración de Astro: sitio estático publicado en GitHub Pages con dominio propio.
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.airesolutionlabs.com',
  // "preserve": cada página sale tal como está en src/pages. Así se mantienen las URL de la etapa A
  // (/aviso-legal.html, /politica-privacidad.html, /404.html) y las páginas nuevas, que son
  // carpetas con index.astro, salen como /servicios/webs-y-captacion/index.html (URL con barra final).
  build: { format: 'preserve' },
  trailingSlash: 'ignore',
});
