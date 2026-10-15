# Reglas para Claude Code en este repo

## Idioma
Responde siempre en español.

## Antes de trabajar
Lee privado/brief-web.md. Es la especificación del proyecto.
La carpeta privado/ solo existe en el PC de Pablo y git la ignora.
Nunca copies su contenido, ni partes de él, a archivos que se suban al repo, a commits, a Pull Requests ni a la web.

## Flujo de trabajo (obligatorio)
- Empieza siempre desde main actualizada y crea una rama nueva por tarea.
- Nunca hagas push a main, nunca hagas merge y nunca uses --force.
- Al terminar, haz push de la rama y abre un Pull Request hacia main. El merge lo hace Pablo.
- Añade los archivos por su nombre. No uses "git add .", "git add -A" ni "git add -f".
- Usa git y gh por su nombre, nunca por ruta completa.

## Cambios visibles
- Mantén arrancada una vista previa local de la web y di a Pablo la dirección para abrirla. Si hace falta instalar algo, pregunta antes.
- Cambios que se ven o se usan (textos, colores, botones, imágenes, menú, formulario, chatbot, enlaces):
  - antes de hacerlos, explica en una frase qué vas a cambiar y en qué parte de la página;
  - después, di qué hay que recargar y dónde mirar;
  - espera el "OK" de Pablo antes del commit. Si dice que no, deshaz el cambio.
- Cambios técnicos que no se ven (robots.txt, sitemap, metadatos, datos estructurados, configuración): hazlos y resúmelos en una línea al terminar cada uno.
- Si cambia el texto de una pregunta o respuesta del FAQ, actualízalo igual, palabra por palabra, en el JSON-LD de FAQPage de index.html, en el mismo commit.

## Seguridad del frontend
- El repo es público y todo lo que llega al navegador (HTML, CSS, JS) también.
- Nunca pongas en el código claves de API, tokens, contraseñas ni URLs de webhooks (Make, n8n, etc.).
- Los secretos van en variables de entorno o en una función de servidor, nunca en archivos del repo.
- Los identificadores públicos de Google Ads (AW-...), Google Analytics (G-...) o Search Console sí pueden ir en la web.
- Si encuentras un secreto ya publicado, avisa a Pablo y no lo copies en ningún otro sitio.

## Etapa B (páginas de servicio, asesoría, sobre y contacto)
- Fuente de los textos: privado/2b/textos-etapa-b.md (aprobados). Se copian literalmente: no se reescriben, no se resumen y no se añaden textos propios. Si falta un texto, se pregunta a Pablo.
- Tratamiento: "usted" con el cliente en toda la web, en primera persona del singular ("trabajo", "le respondo"). La portada pasa de "tú" a "usted" en el PR de la portada.
- Precios: interruptor único `mostrarPrecios` en src/config.js, a `false`. Todo lo marcado como [precio] (columnas de precio, packs, notas de IVA, bloque del coste del primer año) solo se genera con `true`; con `false` no puede aparecer ningún importe ni el símbolo € en el HTML generado. Nunca se oculta con CSS ni con comentarios. Solo Pablo decide cuándo pasa a `true`.
- Bloques con "publicar: no": `publicar: false` en Astro; no se generan (DESIGN §13). No se ocultan con CSS ni con comentarios.
- Mientras `mostrarPrecios` sea `false`, el JSON-LD `Service` no lleva `offers`.
- Las FAQ de cada página salen de la misma lista que su JSON-LD FAQPage: si cambia el texto, cambian los dos a la vez.
- Antes de cada PR, buscar en el HTML generado (dist/) `[`, `TODO`, `pendiente`, `próximamente`, `en construcción` y `€`: 0 en texto visible y 0 € en todo el HTML.

## Datos del negocio
No inventes precios, NIF, direcciones, clientes, cifras ni reseñas. Usa TODO(Pablo) y lístalos al final.
No escribas en el repo datos personales, legales o de clientes de Pablo.
