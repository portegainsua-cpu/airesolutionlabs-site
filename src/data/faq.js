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
