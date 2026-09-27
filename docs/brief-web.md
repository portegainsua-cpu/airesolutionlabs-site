# Brief: rediseño y optimización SEO/GEO de airesolutionlabs.com

- **Fecha:** 24/09/2026
- **Autor del análisis:** Claude (Cowork), para ejecutar con Claude Code
- **Estado:** propuesta. D1, D2 y D4 decididas; D3 decidida con importes pendientes. El resto de decisiones marcadas como pendientes requieren el visto bueno de Pablo antes de implementarse.
- **Ubicación recomendada en el repo:** `docs/brief-web.md`

---

## 0. Instrucciones para Claude Code

1. Lee este documento entero antes de tocar código.
2. **Flujo con GitHub (Pablo aprueba siempre):**
   - Una rama por tarea (`fase0-inventario`, `fase1-arreglos`, `fase2-...`). Nunca trabajes ni hagas push en `main`.
   - Commits pequeños y descriptivos. Push solo de la rama de trabajo.
   - Al terminar cada tarea, abre un Pull Request hacia `main` con: resumen, lista de cambios, cómo probarlo en local, Lighthouse antes/después y `TODO(Pablo)`.
   - **Nunca hagas merge** de un PR, no borres ramas, no uses `--force`, no cambies ajustes del repo ni de GitHub Pages, no toques DNS. El merge lo hace Pablo desde GitHub.
3. Empieza por la **Fase 0** (inventario, solo lectura) y entrega un informe breve antes de seguir.
4. No inventes datos: cifras de clientes, reseñas, precios, NIF, dirección o enlaces que no estén en este documento se dejan como `TODO(Pablo)` y se listan al final de cada fase.
5. Cada fase termina con: lista de cambios, capturas móvil y escritorio, resultado de Lighthouse (móvil) y los `TODO(Pablo)` abiertos.

---

## 1. Diagnóstico de la web actual

Revisado el código del proyecto (`index.html`, `index.css`, `index.js`, legales) y la versión publicada el 24/09/2026.

### 1.1 SEO técnico y GEO (hechos verificados)

| # | Problema | Evidencia | Impacto |
|---|---|---|---|
| T1 | No hay `robots.txt` | `/robots.txt` devuelve 404 | Los rastreadores asumen permiso, pero no hay sitemap declarado ni control por bot |
| T2 | No hay `sitemap.xml` | `/sitemap.xml` devuelve 404 | Descubrimiento e indexación más lentos |
| T3 | No hay `llms.txt` | `/llms.txt` devuelve 404 | Menor. Google dice que no lo necesita (ver §2) |
| T4 | `<head>` mínimo | Solo `title`, `description`, `viewport`. Sin `canonical`, sin Open Graph, sin Twitter Card, sin JSON-LD | Sin datos estructurados de la entidad; vista previa pobre al compartir en LinkedIn/WhatsApp |
| T5 | Web de una sola página | Todo en `/` con anclas | Una sola URL compite por 10 servicios distintos. Los buscadores y los LLM citan páginas; con una sola, hay poca superficie citable |
| T6 | Contenido de servicios y FAQ dentro de pestañas y acordeones | Clases `hidden` y `max-height: 0` | Sigue en el HTML (es indexable), pero el usuario ve una fracción. Mejor en páginas propias |
| T7 | Tailwind por Play CDN en producción | `<script src="https://cdn.tailwindcss.com">` | Tailwind: "designed for development purposes only, and is not intended for production". Genera el CSS en el navegador: más JS, parpadeo de estilos |
| T8 | Mezcla `www` y sin `www` | Enlaces a `https://airesolutionlabs.com` y a `https://www.airesolutionlabs.com` | Riesgo de duplicado sin canónica |
| T9 | Nombre de marca inconsistente | "AI Resolution", "AI Resolution Labs", "AIResolutionLabs" | Los LLM construyen la entidad por coincidencia de nombre. Tres nombres diluyen la entidad |
| T10 | Sin señales locales | Ninguna mención a Sevilla/Andalucía en títulos, textos ni schema | No compite en búsquedas locales ("consultor IA Sevilla"), que es donde una pyme tiene opciones reales |
| T11 | Sin analítica | No hay script de medición | No se puede saber qué funciona ni si llegan visitas desde ChatGPT/Perplexity |
| T12 | Imágenes sin dimensiones ni formatos modernos | `pablo.jpg` sin `width/height`, sin WebP/AVIF | CLS y peso |
| T13 | Sin `og:image`, `apple-touch-icon` ni `manifest` | Solo `favicon.png` | Vista previa y acceso directo pobres |
| T14 | Sin página 404 | `/pagina-que-no-existe` devuelve 404 genérico | Menor |

### 1.2 Contenido y credibilidad

| # | Problema | Dónde | Por qué importa |
|---|---|---|---|
| C1 | Afirmaciones no verificables | "Reducción del 70% de la carga de soporte", "ahorrar cientos de horas al mes", "cero errores humanos", "100% fluida", "Máxima seguridad garantizada" | Sin casos que lo respalden. Riesgo de publicidad engañosa y resta credibilidad ante clientes y ante los LLM, que priorizan datos con fuente |
| C2 | Afirmación técnica incorrecta | FAQ: "cifrado de extremo a extremo (AES-256)" | Si los datos pasan por APIs de OpenAI/Anthropic/Make, no es cifrado de extremo a extremo: el proveedor descifra para procesar. Hay que describirlo como cifrado en tránsito (TLS) y en reposo según proveedor |
| C3 | Promesas de cumplimiento absolutas | "Cumple estrictamente el AI Act art. 50" | El art. 50 es aplicable desde el 2/08/2026. Hay que poder demostrarlo en cada chatbot entregado; hoy el propio chatbot de la web no muestra ese aviso de forma visible (verificar) |
| C4 | Planes nombrados y no definidos | "Plan Cimientos, Flujos Activos y Cerebro Digital" en FAQ y condiciones | El visitante no sabe qué incluyen ni cuánto cuestan |
| C5 | Precios que ya no son la referencia | FAQ: tarjetas 49 €, Asesoría Flash 199 €, automatizaciones 299–450 € | El plan de productos del 24/09/2026 dice que la mensualidad del catálogo no sirve de referencia |
| C6 | Métodos de pago anunciados | Tarjeta, PayPal, Bizum, transferencia, SEPA | Verificar que existen. Todavía no hay alta como autónomo |
| C7 | Cero pruebas | Sin casos, sin reseñas, sin logos, sin números reales | Es lo que más pesa en B2B y en GEO (E-E-A-T) |
| C8 | Textos genéricos de agencia | "La Magia de la Tecnología", "Democratizamos la IA", "siguiente nivel" | Intercambiables con cualquier competidor. Google pide "non-commodity content" |
| C9 | Mezcla de tratamiento | Web en "tú", chatbot en "usted" | Incoherencia de voz |

### 1.3 Cosas sin funcionalidad o que molestan

- Tarjetas del hero (`.tech-card`) con `cursor: pointer` y efecto de clic que no lleva a ningún sitio.
- Resplandor que sigue al ratón (`#mouse-glow`), rejilla de fondo y aro giratorio en la foto: decoración que consume CPU y no aporta.
- 12 botones idénticos "Evaluar Viabilidad Gratis" que van al mismo Cal.com.
- Enlace a la propia web dentro de la sección de contacto.
- El logo del header apunta a `#`.
- `alert()` para confirmar el envío del formulario. El texto dice "Nos pondremos en contacto contigo en info@airesolutionlabs.com" (confunde remitente y destinatario).
- El mensaje de error de privacidad dice "para agendar la sesión" en un formulario de contacto.
- Emojis como iconos: se ven distintos en cada sistema operativo.

### 1.4 Accesibilidad (medido)

| Combinación | Contraste | WCAG AA texto normal (4,5:1) |
|---|---|---|
| `#0057FF` (azul FAQ) sobre `#0A0E17` | 3,5:1 | No cumple |
| Blanco sobre `#8b5cf6` (botones morados, texto 12 px) | 4,23:1 | No cumple |
| `gray-500` (`#6b7280`) sobre `#030712` (copyright, pistas) | 4,16:1 | No cumple |
| `gray-400` sobre `#030712` | 7,93:1 | Cumple |

Además: `focus:outline-none` en botones elimina el foco visible del teclado; los acordeones no usan `aria-expanded`; no hay enlace "saltar al contenido"; las animaciones no respetan `prefers-reduced-motion`.

### 1.5 Seguridad y legal

| # | Problema | Riesgo |
|---|---|---|
| L1 | URL del webhook de Make visible en `index.js` | Cualquiera puede enviarle peticiones y gastar operaciones de Make o llenarte de spam. Sin honeypot ni captcha |
| L2 | Aviso legal con marcadores publicados: `[Introducir CIF definitivo]`, `[Introducir dirección fiscal]` | La LSSI (art. 10) exige identificar al titular (nombre, NIF, domicilio, email). Hoy se ve a medio hacer |
| L3 | Asteriscos de Markdown dentro del HTML | En `condiciones.html` y `politica-privacidad.html` se muestran literalmente `**permanencia mínima...**` |
| L4 | Política de privacidad incompleta | No identifica al responsable, ni base jurídica, ni plazo de conservación, ni derecho a reclamar ante la AEPD. Habla de "derechos ARCO" (terminología anterior al RGPD). No menciona a Make (recibe el formulario), Botpress (chatbot) ni Google Fonts |
| L5 | Google Fonts cargada desde Google | Transfiere la IP del visitante a Google. En Alemania hubo condena por esto (LG München I, 2022). En la tarjeta ya se decidió alojar fuentes en local; aplicar lo mismo |
| L6 | Sin política de cookies ni banner | Verificar si Botpress o Cal.com guardan cookies/almacenamiento no esencial. Si lo hacen, hace falta consentimiento previo |
| L7 | Actividad comercial antes del alta | Precios y formas de pago publicados sin alta como autónomo ni compatibilidad resuelta (ver plan de productos). Decisión de Pablo, no técnica |

---

## 2. Qué dicen las fuentes oficiales sobre GEO (septiembre 2026)

**Hechos (documentación oficial):**

- **Google** (guía de optimización para IA generativa, actualizada 10/07/2026): para salir en AI Overviews y AI Mode la página tiene que estar indexada y ser rastreable; lo que más influye es contenido "unique, compelling, and useful". Dice explícitamente que **no** hacen falta `llms.txt`, ni marcado especial, ni trocear el contenido, ni escribir de una forma concreta para IA. Recomienda Google Business Profile para visibilidad local y ofrece un informe de rendimiento de IA generativa en Search Console.
- **OpenAI:** para aparecer en la búsqueda de ChatGPT hay que permitir `OAI-SearchBot` en `robots.txt`. `GPTBot` es el rastreador de entrenamiento y se controla aparte.
- **Anthropic:** `Claude-SearchBot` indexa para las búsquedas de Claude; bloquearlo "may reduce your site's visibility". `ClaudeBot` es entrenamiento; `Claude-User` actúa cuando un usuario pide leer una URL.
- **Google FAQ rich results:** Google dejó de mostrarlos el 7/05/2026. El schema `FAQPage` sigue siendo válido y puede quedarse, pero ya no da fragmento enriquecido.
- **Cloudflare:** desde 2025 bloquea por defecto rastreadores de IA en dominios nuevos y en 2026 cambió de nuevo los valores por defecto. Si la web se migra a Cloudflare, hay que revisar "AI Crawl Control" para no bloquear los bots de búsqueda sin querer.

**Evidencia académica, con matices:**

- El paper GEO (Aggarwal et al., KDD 2024, Princeton) midió hasta un 40 % más de visibilidad en respuestas generativas al añadir citas de fuentes, estadísticas y citas textuales. Es un banco de pruebas de laboratorio, no una garantía en ChatGPT o Gemini reales. Útil como criterio de redacción, no como promesa.

**Conclusión práctica:** el GEO de una pyme se gana con lo mismo que el buen SEO, más tres cosas concretas: entidad de marca coherente (mismo nombre, mismos datos en todas partes), contenido propio con datos verificables (casos, precios, procesos) y dejar pasar a los bots de búsqueda de IA.

---

## 3. Qué hacen webs similares (consultoras de IA en Sevilla)

Revisadas: SANCANTIA (`/consultoria-ia-sevilla`), Onabitz (`/servicios/consultoria-ia/sevilla`) y el listado de Sortlist Sevilla.

| Elemento | SANCANTIA | Onabitz | Web actual | Acción |
|---|---|---|---|---|
| Página específica "IA en Sevilla" | Sí | Sí | No | Copiar |
| Bio de la fundadora con credenciales | Sí | No | Frase breve | Copiar y mejorar |
| Método paso a paso | Sí (4 pasos) | No | En el dossier, no en la web | Copiar |
| Páginas por sector | 8 sectores | No | No | Solo cuando haya contenido real por sector (ver §4.3) |
| Lead magnet | Checklist "10 procesos que una pyme puede automatizar" | No | No | Copiar con versión propia |
| Diagnóstico gratuito | 15 min | "¿Hablamos?" | 30 min | Mantener |
| Precios | Página aparte "¿Cuánto cuesta?" | No | Dentro del FAQ | Página propia (D3: importes pendientes) |
| Casos con números | No | No | No | **Hueco a ocupar**: ninguno de los dos lo tiene |
| Reseñas | No | No | No | Añadir cuando existan reseñas reales en Google |
| Tema visual | Claro | Claro | Muy oscuro | Ver §5 |
| OG, canonical, geo meta | Sí | — | No | Copiar (OG y canonical) |

Lo que no copiar: textos de relleno con datos del Puerto de Sevilla o polígonos industriales para parecer local. Aporta poco al cliente y roza el contenido para buscadores.

---

## 4. Propuesta

### 4.1 Arquitectura de páginas

```
/                                   Home
/servicios/                         Índice de servicios
/servicios/automatizacion-procesos/ Make/n8n, integraciones, facturación, CRM
/servicios/agentes-ia-chatbots/     Chatbot web, agentes de soporte y ventas, WhatsApp
/servicios/webs-seo-geo/            Webs rápidas preparadas para buscadores e IA
/servicios/tarjetas-digitales/      Tarjeta virtual + reservas (enlaza a la demo)
/servicios/formacion-ia-empresas/   Asesoría Flash, formación Copilot/ChatGPT/Claude
/servicios/microsoft-365/           Implantación M365 Business (PENDIENTE D6)
/consultoria-ia-sevilla/            Página local
/casos/                             Índice de casos
/casos/<slug>/                      Un caso por página
/sobre/                             Pablo: trayectoria, forma de trabajar
/precios/                           Precios orientativos (importes pendientes, D3)
/blog/ y /blog/<slug>/              Guías
/contacto/                          Formulario + Cal.com
/aviso-legal/ /privacidad/ /cookies/ /condiciones/
/404
/robots.txt /sitemap.xml /llms.txt
```

### 4.2 Contenido de cada página de servicio (plantilla)

1. H1 con el servicio y el público: "Automatización de procesos para pymes en Sevilla".
2. Respuesta directa en 2–3 frases: qué es, para quién, qué resultado da. Es el párrafo que un LLM puede citar tal cual.
3. Problemas que resuelve (3–5, concretos).
4. Qué incluye y qué no incluye.
5. Cómo se trabaja: pasos y plazos reales.
6. Herramientas usadas (Make, n8n, Cal.com, Botpress, M365…), con enlace a la fuente oficial.
7. Precio orientativo o "desde" (según D3).
8. Caso relacionado, si existe.
9. FAQ específica del servicio (4–6 preguntas), con schema `FAQPage`.
10. Un CTA principal (diagnóstico de 30 min) y uno secundario (contacto).

### 4.3 Qué quitar

- Tailwind Play CDN (sustituir por CSS compilado).
- Resplandor de ratón, rejilla de fondo, aro giratorio y tarjetas del hero sin acción.
- Pestañas de servicios con tablas de 5 columnas (el contenido pasa a páginas de servicio).
- Los 12 botones repetidos; queda un CTA por bloque.
- Afirmaciones de §1.2 C1, C2 y C3 tal como están redactadas.
- Métodos de pago y planes con nombre mientras no existan de verdad (D3, D7).
- Enlace a la propia web en contacto, `alert()`, emojis como iconos.
- Google Fonts remota (alojar Outfit en local, `font-display: swap`, solo los pesos usados).

### 4.4 Qué añadir

**Pruebas (prioridad alta):**
- Casos reales, cada uno con: contexto, problema, solución, herramientas, resultado medido y fecha. Candidatos:
  - Implantación de Microsoft 365 + formación en Copilot para Gorespro (solo con permiso por escrito del cliente; si no, anonimizado).
  - Redyapp / checklist digital de material de vehículos de un parque de bomberos (proyecto propio; describir sin datos internos del Consorcio).
  - Tarjeta digital + reservas (tarjeta de Pablo y piloto de Irene, con permiso).
- Demos en vivo: "prueba mi tarjeta" (founder.airesolutionlabs.com) y el chatbot de la web presentado como demo de lo que se entrega.
- Reseñas reales de Google Business Profile cuando existan. Nunca reseñas escritas por nosotros (prohibido por la normativa de consumo desde la Directiva Ómnibus).

**Entidad y E-E-A-T:**
- Nombre único de marca en todo el sitio, schema, LinkedIn y Google Business Profile (D1).
- Página `/sobre/` con foto, trayectoria, en qué trabaja y enlaces verificables (LinkedIn, tarjeta). Autor visible en cada artículo.
- Google Business Profile como negocio de área de servicio (sin dirección pública si no se quiere), categoría consultoría, área Sevilla y provincia.

**Captación:**
- Lead magnet: "Checklist: 12 tareas que tu pyme puede automatizar este mes" (PDF o página), a cambio de email con consentimiento.
- Calculadora de horas recuperadas (tarea × minutos × frecuencia × coste/hora → horas y € al mes). Es útil, enlazable y cualifica al lead. Sin prometer resultados: muestra la fórmula.
- Suscripción a la newsletter "Radar SEO" de LinkedIn.

**Blog inicial (4 artículos con datos y fuentes):**
1. "Qué obliga el artículo 50 del AI Act a un chatbot de pyme desde el 2 de agosto de 2026".
2. "Cuánto cuesta automatizar un proceso en una pyme: ejemplos con Make y n8n" (con precios reales de las herramientas y horas de trabajo).
3. "Cómo aparecer en ChatGPT, Perplexity y AI Overviews: lo que dicen Google, OpenAI y Anthropic".
4. "Tarjeta de visita digital vs Linktree vs app: qué elegir para un negocio local" (reutiliza el análisis de competencia del plan de productos).

**Transparencia IA:**
- Aviso visible en el chatbot: "Estás hablando con un asistente de IA" (art. 50).
- Página o sección "Cómo usamos la IA": qué proveedores, qué datos, qué no se usa para entrenar (con enlace a las condiciones de cada proveedor).

### 4.5 Textos: reglas de redacción

- Primera frase de cada sección = respuesta. Luego detalle.
- Cifras solo con fuente o con caso propio. Si no hay dato, se describe el proceso, no el resultado.
- Nada de "magia", "siguiente nivel", "democratizamos", "100%", "garantizado".
- Tuteo en web y chatbot (o usted en ambos, D8).
- Cada página responde a una pregunta que un cliente haría a ChatGPT. Lista de preguntas objetivo en §7.8.

---

## 5. Diseño

**Diagnóstico:** fondo casi negro (`#030712`) en todo el sitio, cuatro colores de acento que no conviven (`#3b82f6`, `#8b5cf6`, `#0057FF`, `#0A192F` en Cal.com), efectos de brillo y cristal. Da aspecto de plantilla "tech" y no de consultor para pymes. Los competidores locales revisados usan tema claro.

**Opciones (D2: elegida la A):**

| Opción | Descripción | A favor | En contra |
|---|---|---|---|
| A. Claro con acentos oscuros (recomendada) | Fondo blanco/gris muy claro, texto casi negro, un solo acento (violeta `#6d28d9` o azul `#1d4ed8`, ambos ≥ 4,5:1 sobre blanco con texto blanco encima). Hero y CTA final en bloque oscuro | Más legible para un público no técnico, contraste fácil, más aspecto de consultora | Se aleja del estilo de la tarjeta actual |
| B. Doble tema automático | Claro por defecto, oscuro si el sistema lo pide (`prefers-color-scheme`), con selector | Contenta a todos | El doble de trabajo de QA en cada componente |
| C. Oscuro revisado | Mantener oscuro pero con un solo acento, sin efectos, y contrastes AA | Continuidad con la tarjeta | Sigue siendo la opción menos habitual en el sector |

**Sistema común a cualquier opción:**
- Tokens de diseño en CSS (`--color-*`, `--space-*`, `--radius-*`), un acento y un neutro.
- Tipografía: Outfit para títulos, y para texto largo valorar una sans más legible en cuerpo (Inter o la propia del sistema).
- Iconos SVG de una sola familia (Lucide o Heroicons, licencias MIT).
- Componentes: header, footer, botón primario/secundario, tarjeta de servicio, bloque de caso, acordeón accesible (`<details>/<summary>`), tabla de precios, formulario.
- Movimiento mínimo y con `prefers-reduced-motion`.
- La tarjeta digital y la web comparten tokens, para que se vean de la misma marca.

---

## 6. Especificación técnica

### 6.1 Stack

- **Recomendado: Astro en modo estático.** Genera HTML puro (0 KB de JS por defecto), permite componentes y plantillas reutilizables (las mismas secciones servirán para las webs de clientes, fase 4 del plan de productos), colecciones de contenido en Markdown para blog y casos, e integración oficial de sitemap.
- Alternativa: HTML estático + Tailwind CLI compilado. Menos dependencias, pero cada página nueva es copia y pega.
- **Hosting (PENDIENTE D5):** confirmar dónde está hoy (Fase 0). Recomendado Cloudflare Pages, por coherencia con las tarjetas de clientes. Si se migra: redirecciones 301, cabeceras de seguridad, y revisar AI Crawl Control.

### 6.2 SEO técnico

- Dominio canónico `https://www.airesolutionlabs.com`, 301 desde el apex y desde `http`.
- URLs con barra final y en minúsculas.
- Por página: `title` único (≤ 60 caracteres), `meta description` única (≤ 155), `link rel="canonical"`, Open Graph completo (`og:title`, `og:description`, `og:image` absoluta de 1200×630, `og:locale=es_ES`, `og:type`), Twitter Card `summary_large_image`.
- Un solo H1 por página; jerarquía H2/H3 limpia.
- `sitemap.xml` generado en el build, con `lastmod` real.
- Migas de pan visibles + `BreadcrumbList`.
- Enlazado interno: cada servicio enlaza a su caso, a 1–2 artículos y a contacto.

### 6.3 `robots.txt` propuesto

```
# Buscadores y búsqueda de IA: permitidos
User-agent: *
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

# Entrenamiento de modelos: permitido (D4)
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://www.airesolutionlabs.com/sitemap.xml
```

### 6.4 Datos estructurados (JSON-LD)

En todas las páginas, un `@graph` con `Organization` + `ProfessionalService`, `Person` y `WebSite`. Esqueleto (los `TODO` los rellena Pablo; no inventar):

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": "https://www.airesolutionlabs.com/#org",
      "name": "AI Resolution Labs",
      "url": "https://www.airesolutionlabs.com/",
      "logo": "https://www.airesolutionlabs.com/logo.png",
      "image": "https://www.airesolutionlabs.com/og.png",
      "email": "info@airesolutionlabs.com",
      "description": "Consultoría de automatización e inteligencia artificial para pymes en Sevilla y Andalucía.",
      "areaServed": [
        {"@type": "City", "name": "Sevilla"},
        {"@type": "AdministrativeArea", "name": "Andalucía"},
        {"@type": "Country", "name": "España"}
      ],
      "founder": {"@id": "https://www.airesolutionlabs.com/#pablo"},
      "sameAs": [
        "TODO(Pablo): URL de LinkedIn de la empresa",
        "TODO(Pablo): URL de Google Business Profile"
      ],
      "knowsAbout": ["Automatización de procesos", "Make", "n8n", "Agentes de IA", "Chatbots", "Microsoft 365", "SEO", "GEO"]
    },
    {
      "@type": "Person",
      "@id": "https://www.airesolutionlabs.com/#pablo",
      "name": "Pablo Ortega Insúa",
      "jobTitle": "Fundador y consultor principal",
      "worksFor": {"@id": "https://www.airesolutionlabs.com/#org"},
      "image": "https://www.airesolutionlabs.com/pablo.webp",
      "url": "https://www.airesolutionlabs.com/sobre/",
      "sameAs": ["https://founder.airesolutionlabs.com/", "TODO(Pablo): LinkedIn personal"]
    },
    {
      "@type": "WebSite",
      "@id": "https://www.airesolutionlabs.com/#web",
      "url": "https://www.airesolutionlabs.com/",
      "name": "AI Resolution Labs",
      "inLanguage": "es-ES",
      "publisher": {"@id": "https://www.airesolutionlabs.com/#org"}
    }
  ]
}
```

Además: `Service` (con `provider` → `#org`, `areaServed`, y `offers` solo si hay precio publicado) en cada página de servicio; `FAQPage` donde haya FAQ visible; `Article` con `author` → `#pablo`, `datePublished` y `dateModified` en el blog; `BreadcrumbList` en todas las internas. Todo el schema debe coincidir con el texto visible. Validar con validator.schema.org.

### 6.5 `llms.txt`

Coste bajo y efecto no demostrado (Google dice que no lo usa). Hacerlo al final: un Markdown en la raíz con nombre de marca, una frase de qué hace, y enlaces a servicios, casos, precios, sobre y contacto. Generarlo en el build a partir de las mismas colecciones de contenido, para que no se desactualice.

### 6.6 Rendimiento

- Objetivo de laboratorio (Lighthouse móvil): ≥ 95 en Rendimiento, Accesibilidad, Buenas prácticas y SEO.
- Core Web Vitals: LCP < 2,5 s, INP < 200 ms, CLS < 0,1.
- JS propio < 30 KB comprimido en páginas sin chatbot.
- Imágenes AVIF/WebP con `width`/`height`, `loading="lazy"` salvo la imagen principal (`fetchpriority="high"`).
- Cal.com y Botpress cargados solo al hacer clic (fachada ligera con el botón, y el script se inyecta en ese momento).
- Fuentes locales con `preload` del peso principal.

### 6.7 Formulario de contacto y seguridad

- El formulario envía a una función propia (Cloudflare Pages Function o Worker) que valida, aplica honeypot y Cloudflare Turnstile, y reenvía a Make. La URL del webhook sale del código público y va a una variable de entorno.
- Rotar el webhook actual de Make después del cambio, porque ya es público.
- Mensajes de éxito y error en la propia página (`aria-live`), sin `alert()`.
- Cabeceras: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.

### 6.8 Analítica y medición GEO

- Cloudflare Web Analytics (sin cookies) o Plausible/Umami. Decisión en D5.
- Eventos: clic en "Reservar diagnóstico", envío de formulario, descarga del lead magnet, apertura del chatbot.
- Segmento de tráfico que llega desde `chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `copilot.microsoft.com`, `claude.ai`.
- Alta en Google Search Console (incluye el informe de IA generativa) y Bing Webmaster Tools, con envío del sitemap. IndexNow en el build.
- Seguimiento mensual manual: las preguntas de §7.8 en ChatGPT, Perplexity, Gemini y Copilot. Anotar si aparece la marca, en qué posición y qué URL citan.

### 6.9 Legal (redactar con revisión profesional)

- Aviso legal con los datos reales del titular (LSSI art. 10) en cuanto exista el alta. Hasta entonces, **no** publicar marcadores.
- Política de privacidad completa: responsable, finalidades, base jurídica, conservación, destinatarios (Make, Cal.com, Botpress, Google Workspace, hosting), transferencias internacionales, derechos y reclamación ante la AEPD.
- Política de cookies y banner solo si algún servicio usa cookies no esenciales (verificar Botpress y Cal.com). Si se cargan solo al hacer clic, puede bastar con informar.
- Condiciones: eliminar Markdown literal; revisar la cláusula de permanencia y los planes cuando estén definidos.
- Aviso de IA visible en el chatbot (art. 50 AI Act).

### 6.10 Accesibilidad

- WCAG 2.2 AA: contrastes ≥ 4,5:1 (texto normal) y ≥ 3:1 (texto grande y elementos de interfaz).
- Foco visible en todos los elementos interactivos.
- Acordeones con `<details>/<summary>` o `aria-expanded`.
- Enlace "Saltar al contenido", `lang="es"`, textos alternativos útiles.
- Probado con teclado y con lector de pantalla (VoiceOver o NVDA) en home, un servicio y contacto.

---

## 7. Fases y criterios de aceptación

| Fase | Qué | Criterio de hecho | Requiere a Pablo |
|---|---|---|---|
| **0. Inventario** (solo lectura) | Repo, hosting actual, DNS, dónde está el `CNAME`, qué hace el escenario de Make, qué guarda Botpress, estado en Search Console | Informe de 1 página con hallazgos y riesgos | Accesos |
| **1. Arreglos rápidos sobre la web actual** | `robots.txt`, `sitemap.xml`, canonical, OG + imagen, JSON-LD básico, redirección a `www`, unificar marca como "AI Resolution Labs", quitar precios actuales del FAQ, quitar afirmaciones C1–C3, quitar Markdown literal de legales, arreglar contrastes y foco, alta en Search Console y Bing | Validador de schema sin errores; `robots.txt` y `sitemap.xml` con 200; Lighthouse SEO ≥ 95 | Ninguna (D1 y D4 decididas) |
| **2. Nueva base** | Astro + sistema de diseño + home, servicios, sobre, contacto, legales, 404; formulario seguro; fuentes locales; analítica | Criterios de §6.6 y §6.10; 0 errores en consola; todas las URL del sitemap con 200; 301 desde cualquier URL antigua (p. ej. `/aviso-legal.html` → `/aviso-legal/`) | Importes de D3, D5, D6, D8 |
| **3. Contenido GEO** | Página local Sevilla, casos, 4 artículos, lead magnet, calculadora, `llms.txt` | Cada página de §4.1 publicada con su schema; cada caso con permiso documentado | Casos, permisos, textos de bio |
| **4. Local y medición** | Google Business Profile, primeras reseñas reales, informe mensual de visibilidad en IA | Primer informe con las preguntas de §7.8 | Alta de GBP |

### 7.8 Preguntas objetivo para medir visibilidad en IA

1. "Consultor de inteligencia artificial para pymes en Sevilla"
2. "Quién automatiza procesos con Make o n8n en Sevilla"
3. "Cuánto cuesta un chatbot para la web de mi negocio"
4. "Qué tiene que cumplir el chatbot de mi empresa con el AI Act"
5. "Tarjeta de visita digital con reservas para negocios en Sevilla"
6. "Implantar Microsoft 365 y Copilot en una pyme pequeña"
7. "Formación en ChatGPT o Copilot para empleados de una pyme en Sevilla"
8. "Cómo hacer que mi web aparezca en ChatGPT"
9. "AI Resolution Labs" (consulta de marca: comprobar que la describen bien)
10. "Automatizar facturas y citas en un negocio pequeño"

---

## 8. Decisiones pendientes de Pablo

| ID | Decisión | Recomendación |
|---|---|---|
| D1 | Nombre único de marca | **DECIDIDO (24/09/2026): "AI Resolution Labs"** en web, schema, LinkedIn y Google Business Profile |
| D2 | Tema visual | **DECIDIDO: opción A**, claro con bloques oscuros y un solo acento |
| D3 | Precios en la web | **DECIDIDO publicar, PENDIENTE redefinir importes.** Pablo va a rehacer los precios. Hasta entonces: quitar los precios actuales del FAQ (Fase 1), construir `/precios/` y los bloques de precio de cada servicio con `TODO(Pablo)`, y no publicar esas secciones hasta tener cifras |
| D4 | Bots de entrenamiento (`GPTBot`, `ClaudeBot`, `Google-Extended`) | **DECIDIDO: permitir.** Los de búsqueda, siempre permitidos |
| D5 | Hosting y analítica | Cloudflare Pages + Cloudflare Web Analytics |
| D6 | Añadir Microsoft 365 como servicio | Sí, si Gorespro sale bien y da permiso para el caso |
| D7 | Métodos de pago en la web | Quitar hasta que estén operativos |
| D8 | Tú o usted | Tú en web y chatbot |
| D9 | Mencionar el perfil de bombero en `/sobre/` | Es un diferenciador fuerte, pero depende de que la compatibilidad esté resuelta. Decide Pablo |
| D10 | Mantener el chatbot de Botpress | Mantener como demo, con aviso de IA y carga al hacer clic. Revisar en 3 meses cuántas conversaciones genera |

---

## 9. Prompt para pegar en Claude Code

```
Contexto: repo de la web corporativa de AI Resolution Labs (www.airesolutionlabs.com).
Hoy es un index.html de una sola página con Tailwind por CDN, index.css, index.js,
tres páginas legales, Cal.com, Botpress y un formulario que envía a un webhook de Make.

Lee docs/brief-web.md completo. Es la especificación.

Objetivo: convertir la web en un sitio multipágina profesional, rápido y preparado para
buscadores e IA (SEO/GEO), siguiendo las fases del brief.

Entregables de esta sesión: solo la Fase 0.
- Informe de 1 página en docs/fase0-inventario.md: hosting actual y cómo se publica,
  DNS/CNAME, dependencias externas, qué datos envía el formulario y a dónde, qué cookies o
  almacenamiento usan Botpress y Cal.com, tamaño de cada recurso, y cualquier riesgo
  (claves, webhooks o archivos que no deberían estar publicados).
- Lista de TODO(Pablo) con lo que necesitas de mí.
- Propuesta de estructura de carpetas para la Fase 2 (Astro), sin implementarla.

Límites de autonomía:
- Trabaja en la rama fase0-inventario y abre un PR hacia main. No hagas merge, no toques DNS, no borres
  archivos publicados y no rotes el webhook sin mi confirmación.
- No inventes datos de negocio (precios, NIF, dirección, clientes, cifras, reseñas).
  Usa TODO(Pablo).
- Respeta las decisiones D1–D10 del brief: si una está PENDIENTE, no la implementes,
  pregúntame.

Definición de completado: PR abierto con docs/fase0-inventario.md, con hallazgos
verificados (indicando cómo lo comprobaste), riesgos priorizados y la lista de TODO(Pablo).
Después, espera mi confirmación para empezar la Fase 1.
```

---

## 10. Fuentes

- Google Search Central, guía de optimización para funciones de IA generativa (actualizada 10/07/2026): https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google Search Central, AI features and your website: https://developers.google.com/search/docs/appearance/ai-features
- OpenAI, Overview of OpenAI Crawlers: https://developers.openai.com/api/docs/bots
- Anthropic, rastreadores y cómo bloquearlos: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- Tailwind CSS, Play CDN: https://tailwindcss.com/docs/installation/play-cdn
- Aggarwal et al., "GEO: Generative Engine Optimization", KDD 2024: https://arxiv.org/pdf/2311.09735
- Retirada de los FAQ rich results (mayo 2026, fuente secundaria): https://www.getpassionfruit.com/blog/what-changed-with-google-drops-faq-rich-results-and-what-to-do-now
- Cloudflare, cambios en rastreadores de IA: https://www.cloudflare.com/press/press-releases/2025/cloudflare-just-changed-how-ai-crawlers-scrape-the-internet-at-large/ y https://www.helpnetsecurity.com/2026/07/02/cloudflare-ai-crawler-controls/
- AI Act, art. 50 y Ómnibus Digital (fuente secundaria): https://www.ticweb.es/el-ai-act-no-se-ha-aplazado-lo-que-el-omnibus-digital-te-ha-hecho-creer/
- Kit Consulting cerrado (no usar como argumento comercial): https://iasostenible.com/kit-consulting-2026/
- Referencias locales: https://www.sancantia.com/consultoria-ia-sevilla , https://onabitz.com/servicios/consultoria-ia/sevilla , https://www.sortlist.es/s/inteligencia-artificial/sevilla-es
