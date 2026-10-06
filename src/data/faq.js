// Preguntas frecuentes de la portada: fuente única del FAQ visible y del JSON-LD FAQPage.
// Si cambia el texto de una pregunta o respuesta, cambia en los dos sitios a la vez.
// `respuesta` admite enlaces HTML; el texto del FAQPage se obtiene quitando las etiquetas.
// `publicar: false` deja la pregunta preparada sin generarla (DESIGN §13).
export const preguntas = [
  {
    pregunta: '¿Necesito saber de tecnología?',
    respuesta: 'No. Me encargo de la configuración y te enseño a usar lo que entrego, con palabras normales.',
    publicar: true,
  },
  {
    pregunta: 'No tengo tiempo para aprender. ¿Esto es para mí?',
    respuesta: 'Sí, está pensado justo para eso. Yo investigo y lo monto, y la formación se adapta a los huecos que tengas.',
    publicar: true,
  },
  {
    pregunta: '¿Trabajas solo en Sevilla?',
    respuesta: 'No. Tengo la base en Sevilla y trabajo con empresas de toda España, en persona o por videollamada.',
    publicar: true,
  },
  {
    // Pregunta P6 del FAQ anterior, pasada a primera persona por Pablo (06/10/2026)
    pregunta: '¿Puedo conectar las automatizaciones con las herramientas que ya uso?',
    respuesta: 'En la mayoría de los casos, sí. Trabajo con herramientas como Make o n8n, que se conectan con Google Workspace, Microsoft 365, WhatsApp Business, gestores de correo y muchos CRM y ERP. En el diagnóstico gratuito compruebo si tus herramientas concretas lo permiten.',
    publicar: true,
  },
  {
    pregunta: '¿Cuánto cuesta?',
    respuesta: 'Depende de lo que necesites. Antes de empezar te doy un precio cerrado por escrito.',
    publicar: true,
  },
  {
    pregunta: '¿Qué pasa con mis datos?',
    respuesta: 'Antes de empezar te explico qué datos se envían, a qué proveedor y para qué. Lo que pasa con lo que envías por esta web está en la <a href="/politica-privacidad.html">política de privacidad</a>.',
    publicar: true,
  },
];

export const preguntasPublicadas = preguntas.filter((p) => p.publicar);

export const textoPlano = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
