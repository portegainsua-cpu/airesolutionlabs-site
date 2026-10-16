// Formulario de contacto: Cloudflare Turnstile y envío al Apps Script de los formularios
// (el mismo que usa la tarjeta). La validación de verdad la hace el servidor; esta ayuda a quien rellena.
const FORM_AJUSTES = {
  // URL de la aplicación web de Apps Script (es pública; la protección está en el servidor)
  ENDPOINT: 'https://script.google.com/macros/s/AKfycbzCgaigJtDxVea-eIOW5tq_OZKyM_AU4Bv7mUer4SZhgpuEOlUX0wJQLEbWa500PQMFIg/exec',
  // Clave del sitio de Turnstile (es pública). Clave de prueba: 1x00000000000000000000AA
  TURNSTILE_SITEKEY: '0x4AAAAAAFIFiqOfy6ts7wC6',
  // Versión del texto legal que ve la persona (casilla + primera capa de privacidad).
  // Si cambia ese texto, cambia la versión y se anota en el registro de versiones de Pablo.
  VERSION_TEXTO_LEGAL: '2026-10-16',
  // Apps Script puede tardar más de 25 s en responder aunque el envío llegue bien
  TIEMPO_MAXIMO_MS: 45000,
  EMAIL_CONTACTO: 'info@airesolutionlabs.com',
};
// Permite probar en local con ?endpoint=...&sitekey=... sin tocar el código publicado
if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
  const qs = new URLSearchParams(location.search);
  if (qs.get('endpoint')) FORM_AJUSTES.ENDPOINT = qs.get('endpoint');
  if (qs.get('sitekey')) FORM_AJUSTES.TURNSTILE_SITEKEY = qs.get('sitekey');
}

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const tInicio = Date.now();

// Mensajes del formulario. Estos son los de la portada; una página puede sustituir
// cualquiera con data-textos en el formulario (por ejemplo, /contacto/ en "usted").
// `errores`: mensaje bajo cada campo y en el resumen (si no se da, se usa CAMPOS).
const TEXTOS = {
  enviando: 'Enviando...',
  registrando: 'Un momento, lo estoy registrando...',
  exito: (nombre) => `¡Gracias, ${nombre}! He recibido tu mensaje y te responderé al correo que me has indicado.`,
  revisa: 'Revisa los datos del formulario e inténtalo de nuevo.',
  verificacionAntispam: `No se ha podido completar la verificación antispam (puede que un bloqueador la esté impidiendo). Escríbeme a ${FORM_AJUSTES.EMAIL_CONTACTO}.`,
  limite: 'Has enviado varios mensajes seguidos. Espera un rato antes de volver a intentarlo.',
  verificacion: 'No se ha podido verificar el envío. Vuelve a pulsar el botón.',
  general: `No se ha podido enviar tu mensaje. Inténtalo de nuevo o escríbeme a ${FORM_AJUSTES.EMAIL_CONTACTO}.`,
  errores: null,
};
if (contactForm && contactForm.dataset.textos) {
  try {
    const propios = JSON.parse(contactForm.dataset.textos);
    if (typeof propios.exito === 'string') {
      const exito = propios.exito;
      propios.exito = () => exito;
    }
    Object.assign(TEXTOS, propios);
  } catch (err) { /* se quedan los de la portada */ }
}

// Resumen bajo el botón (aria-live), con icono y texto: el color nunca va solo (DESIGN §7.3)
function showFormStatus(text, isError) {
  if (!formStatus) return;
  formStatus.querySelector('[data-texto]').textContent = text;
  formStatus.querySelector('[data-icono-error]').hidden = !isError;
  formStatus.querySelector('[data-icono-exito]').hidden = isError;
  formStatus.classList.toggle('formulario__estado--error', isError);
  formStatus.classList.toggle('formulario__estado--exito', !isError);
  formStatus.hidden = false;
}

function hideFormStatus() {
  if (formStatus) formStatus.hidden = true;
}

// Aviso de espera agotada (tono neutro): el envío puede haber llegado aunque no haya respuesta.
// Se rellena la región aria-live, que ya está en la página, con el contenido de la plantilla.
const formAviso = document.getElementById('form-aviso');
const formAvisoContenido = document.getElementById('form-aviso-contenido');

function mostrarAviso() {
  if (formAviso && formAvisoContenido) formAviso.replaceChildren(formAvisoContenido.content.cloneNode(true));
}

function ocultarAviso() {
  if (formAviso) formAviso.replaceChildren();
}

// Campos que valida el servidor: nombre del campo en el Apps Script → campo del formulario
const CAMPOS = {
  nombre: { id: 'name', etiqueta: 'Nombre', msg: 'escribe tu nombre (entre 2 y 80 caracteres).' },
  email: { id: 'email', etiqueta: 'Email', msg: 'escribe un correo electrónico válido.' },
  mensaje: { id: 'message', etiqueta: '¿Qué te quita tiempo?', msg: 'cuéntanos tu consulta (entre 10 y 2.000 caracteres).' },
  privacidad: { id: 'privacy-agreement', etiqueta: 'Política de Privacidad', msg: 'marca la casilla para confirmar que la has leído.' },
};

const mayuscula = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function limpiar(v) {
  return String(v == null ? '' : v).replace(/\s+/g, ' ').trim();
}

function erroresLocales(datos, privacidad) {
  const errores = [];
  if (datos.nombre.length < 2 || datos.nombre.length > 80) errores.push('nombre');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(datos.email) || datos.email.length > 254) errores.push('email');
  if (datos.mensaje.length < 10 || datos.mensaje.length > 2000) errores.push('mensaje');
  if (!privacidad) errores.push('privacidad');
  return errores;
}

// Error en línea bajo cada campo (enlazado con aria-describedby) y resumen con aria-live
function marcarErrores(campos) {
  Object.keys(CAMPOS).forEach((c) => {
    const el = document.getElementById(CAMPOS[c].id);
    const err = document.getElementById('error-' + CAMPOS[c].id);
    if (el) el.removeAttribute('aria-invalid');
    if (err) err.hidden = true;
  });
  if (!campos.length) return;
  const conocidos = campos.filter((c) => CAMPOS[c]);
  if (!conocidos.length) {
    showFormStatus(TEXTOS.revisa, true);
    return;
  }
  conocidos.forEach((c) => {
    document.getElementById(CAMPOS[c].id).setAttribute('aria-invalid', 'true');
    const err = document.getElementById('error-' + CAMPOS[c].id);
    if (err) {
      err.querySelector('[data-texto]').textContent = TEXTOS.errores ? TEXTOS.errores[c] : mayuscula(CAMPOS[c].msg);
      err.hidden = false;
    }
  });
  showFormStatus(conocidos.map((c) => (TEXTOS.errores ? TEXTOS.errores[c] : `Revisa «${CAMPOS[c].etiqueta}»: ${CAMPOS[c].msg}`)).join(' '), true);
  document.getElementById(CAMPOS[conocidos[0]].id).focus();
}

// Turnstile: su script se carga solo cuando alguien empieza a usar el formulario
const ts = { id: null, token: '', esperando: [], fallo: false, cargado: false };

function resolverToken(tok) {
  ts.token = tok || '';
  const cola = ts.esperando;
  ts.esperando = [];
  cola.forEach((fn) => fn(ts.token));
}

window.onTurnstileCargado = function () {
  try {
    ts.id = window.turnstile.render('#turnstile', {
      sitekey: FORM_AJUSTES.TURNSTILE_SITEKEY,
      theme: 'light',
      language: 'es',
      appearance: 'interaction-only',
      callback: (tok) => { ts.fallo = false; resolverToken(tok); },
      'expired-callback': () => { ts.token = ''; },
      'error-callback': () => { ts.fallo = true; resolverToken(''); return true; },
    });
  } catch (err) {
    ts.fallo = true;
    resolverToken('');
  }
};

function cargarTurnstile() {
  if (ts.cargado) return;
  ts.cargado = true;
  const s = document.createElement('script');
  s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileCargado';
  s.async = true;
  s.defer = true;
  s.onerror = () => { ts.fallo = true; resolverToken(''); };
  document.head.appendChild(s);
}

function obtenerToken(msMax) {
  if (ts.token) return Promise.resolve(ts.token);
  if (ts.fallo) return Promise.resolve('');
  return new Promise((resolve) => {
    let hecho = false;
    ts.esperando.push((t) => { if (!hecho) { hecho = true; resolve(t); } });
    setTimeout(() => { if (!hecho) { hecho = true; resolve(''); } }, msMax);
  });
}

function reiniciarTurnstile() {
  ts.token = '';
  if (window.turnstile && ts.id !== null) {
    try { window.turnstile.reset(ts.id); } catch (err) { /* sin efecto */ }
  }
}

if (contactForm) {
  const submitBtn = document.getElementById('form-submit-btn');
  const originalBtnText = submitBtn.textContent;

  function ocupado(si, texto) {
    submitBtn.disabled = si;
    submitBtn.textContent = si ? texto : originalBtnText;
    contactForm.setAttribute('aria-busy', si ? 'true' : 'false');
  }

  contactForm.addEventListener('focusin', cargarTurnstile);

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Previene la recarga convencional de la página
    hideFormStatus();
    ocultarAviso();
    cargarTurnstile();

    const datos = {
      nombre: limpiar(document.getElementById('name').value),
      email: limpiar(document.getElementById('email').value).toLowerCase(),
      mensaje: document.getElementById('message').value.trim(),
    };
    const errores = erroresLocales(datos, document.getElementById('privacy-agreement').checked);
    if (errores.length) {
      marcarErrores(errores);
      return;
    }
    marcarErrores([]);

    ocupado(true, TEXTOS.enviando);
    obtenerToken(12000).then((token) => {
      if (!token) {
        ocupado(false);
        showFormStatus(TEXTOS.verificacionAntispam, true);
        return null;
      }
      // Apps Script tarda unos segundos en responder: se avisa para que nadie pulse dos veces
      ocupado(true, TEXTOS.registrando);
      const cuerpo = {
        formulario: 'contacto',
        datos: datos,
        consentimientos: {
          privacidad: true,
          comunicaciones: false,
          version_texto: FORM_AJUSTES.VERSION_TEXTO_LEGAL,
        },
        turnstile: token,
        web_empresa: contactForm.elements.web_empresa ? contactForm.elements.web_empresa.value : '',
        t_relleno: Date.now() - tInicio,
        referido: '',
      };
      const ctrl = 'AbortController' in window ? new AbortController() : null;
      const temporizador = setTimeout(() => { if (ctrl) ctrl.abort(); }, FORM_AJUSTES.TIEMPO_MAXIMO_MS);
      return fetch(FORM_AJUSTES.ENDPOINT, {
        method: 'POST',
        // text/plain evita la petición previa de CORS que Apps Script no admite
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(cuerpo),
        redirect: 'follow',
        signal: ctrl ? ctrl.signal : undefined,
      }).then((res) => {
        clearTimeout(temporizador);
        return res.json();
      }).then((r) => {
        ocupado(false);
        reiniciarTurnstile();
        if (r && r.ok) {
          showFormStatus(TEXTOS.exito(datos.nombre), false);
          contactForm.reset();
        } else if (r && r.error === 'validacion' && r.campos) {
          marcarErrores(r.campos);
        } else if (r && r.error === 'limite') {
          showFormStatus(TEXTOS.limite, true);
        } else if (r && r.error === 'verificacion') {
          showFormStatus(TEXTOS.verificacion, true);
        } else {
          showFormStatus(TEXTOS.general, true);
        }
      });
    }).catch((error) => {
      console.error('Error al enviar formulario:', error);
      ocupado(false);
      reiniciarTurnstile();
      if (error && error.name === 'AbortError') {
        // Se agotó la espera, pero el servidor puede haberlo registrado: aviso neutro, los campos se
        // conservan y el texto no invita a reenviar, para no duplicar solicitudes
        mostrarAviso();
      } else {
        showFormStatus(TEXTOS.general, true);
      }
    });
  });
}
