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

## Seguridad del frontend
- El repo es público y todo lo que llega al navegador (HTML, CSS, JS) también.
- Nunca pongas en el código claves de API, tokens, contraseñas ni URLs de webhooks (Make, n8n, etc.).
- Los secretos van en variables de entorno o en una función de servidor, nunca en archivos del repo.
- Los identificadores públicos de Google Ads (AW-...), Google Analytics (G-...) o Search Console sí pueden ir en la web.
- Si encuentras un secreto ya publicado, avisa a Pablo y no lo copies en ningún otro sitio.

## Datos del negocio
No inventes precios, NIF, direcciones, clientes, cifras ni reseñas. Usa TODO(Pablo) y lístalos al final.
No escribas en el repo datos personales, legales o de clientes de Pablo.
