// Datos estructurados comunes (brief §6.4): organización, persona y web, y ayudas para
// BreadcrumbList y FAQPage. Todo debe coincidir con el texto visible de la página.
import { textoPlano } from './faq.js';

export const sitio = 'https://www.airesolutionlabs.com';

export const organizacion = {
  '@type': ['Organization', 'ProfessionalService'],
  '@id': `${sitio}/#org`,
  name: 'AI Resolution Labs',
  url: `${sitio}/`,
  logo: `${sitio}/icon-512.png`,
  email: 'info@airesolutionlabs.com',
  // Brief §8g
  description: 'Consultoría de tecnología e IA desde Sevilla para empresas de toda España',
  areaServed: [
    { '@type': 'City', name: 'Sevilla' },
    { '@type': 'Country', name: 'España' },
  ],
  founder: { '@id': `${sitio}/#pablo` },
  // Catálogo de servicios v1
  knowsAbout: [
    'Asesoría en tecnología e IA',
    'Webs y captación',
    'Tarjetas digitales',
    'Reservas automáticas',
    'Formularios con seguimiento',
    'Automatizaciones e integraciones',
    'Aplicaciones a medida',
    'Implantación de Microsoft 365 y Google Workspace',
    'Formación en IA para equipos',
  ],
};

export const persona = {
  '@type': 'Person',
  '@id': `${sitio}/#pablo`,
  name: 'Pablo Ortega Insúa',
  jobTitle: 'Fundador y Consultor Principal',
  worksFor: { '@id': `${sitio}/#org` },
  image: `${sitio}/pablo.webp`,
  url: `${sitio}/sobre/`,
  sameAs: [
    'https://founder.airesolutionlabs.com/',
    'https://www.linkedin.com/in/pablo-ortega-ins%C3%BAa-775b92277/',
  ],
};

export const web = {
  '@type': 'WebSite',
  '@id': `${sitio}/#web`,
  url: `${sitio}/`,
  name: 'AI Resolution Labs',
  inLanguage: 'es-ES',
  publisher: { '@id': `${sitio}/#org` },
};

// Migas: [{ nombre, ruta }]; la última es la página actual
export const migasLd = (ruta, migas) => ({
  '@type': 'BreadcrumbList',
  '@id': `${sitio}${ruta}#migas`,
  itemListElement: migas.map((m, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: m.nombre,
    item: `${sitio}${m.ruta}`,
  })),
});

// FAQPage con el mismo texto que el FAQ visible (sin las etiquetas de los enlaces)
export const faqLd = (ruta, preguntas) => ({
  '@type': 'FAQPage',
  '@id': `${sitio}${ruta}#faq`,
  inLanguage: 'es-ES',
  mainEntity: preguntas.map((p) => ({
    '@type': 'Question',
    name: p.pregunta,
    acceptedAnswer: { '@type': 'Answer', text: textoPlano(p.respuesta) },
  })),
});

// Página web con sus migas
export const paginaLd = (ruta, tipo, titulo, descripcion) => ({
  '@type': tipo,
  '@id': `${sitio}${ruta}#pagina`,
  url: `${sitio}${ruta}`,
  name: titulo,
  description: descripcion,
  inLanguage: 'es-ES',
  isPartOf: { '@id': `${sitio}/#web` },
  breadcrumb: { '@id': `${sitio}${ruta}#migas` },
});

// Servicio de una página de servicio. Sin offers mientras no haya precio publicado (brief §6.4).
export const servicioLd = (ruta, nombre, descripcion) => ({
  '@type': 'Service',
  '@id': `${sitio}${ruta}#servicio`,
  name: nombre,
  serviceType: nombre,
  description: descripcion,
  url: `${sitio}${ruta}`,
  provider: { '@id': `${sitio}/#org` },
  areaServed: [
    { '@type': 'City', name: 'Sevilla' },
    { '@type': 'Country', name: 'España' },
  ],
});
