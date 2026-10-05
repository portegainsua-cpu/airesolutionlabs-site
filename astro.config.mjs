// Configuración de Astro: sitio estático publicado en GitHub Pages con dominio propio.
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.airesolutionlabs.com',
  // Mismas URL que la web anterior: /aviso-legal.html, /politica-privacidad.html y /404.html
  build: { format: 'file' },
  trailingSlash: 'never',
});
