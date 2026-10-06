// Reservas con Cal.com (modal)
// embed.js se descarga solo al pulsar un botón de reserva. Mientras carga, el botón
// muestra "Cargando…"; si no está listo en 5 segundos, se abre cal.com en una pestaña nueva.
// Los botones usan data-cal-booking (y no data-cal-link) para que el propio embed.js
// no abra un segundo modal con su escucha de clics.
const CAL_EMBED_URL = 'https://app.cal.com/embed/embed.js';
const LOAD_TIMEOUT_MS = 5000;
let calState = 'idle'; // idle | loading | ready | failed
let pendingButton = null;
let timeoutId = null;

function loadCalEmbed() {
  timeoutId = setTimeout(onCalFailed, LOAD_TIMEOUT_MS);

  // Fragmento oficial de Cal.com (incluye Cal.ns)
  (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, CAL_EMBED_URL, "init");

  window.Cal('init', { origin: 'https://app.cal.com' });
  window.Cal('ui', {
    styles: { branding: { brandColor: '#2347C5' } },
    hideEventTypeDetails: false,
    layout: 'month_view',
  });

  const script = document.querySelector(`script[src="${CAL_EMBED_URL}"]`);
  if (!script) {
    onCalFailed();
    return;
  }
  script.addEventListener('load', () => {
    // Si embed.js falla al arrancar, no crea Cal.instance
    if (window.Cal && window.Cal.instance) {
      onCalReady();
    } else {
      onCalFailed();
    }
  });
  script.addEventListener('error', onCalFailed);
}

function openModal(button) {
  let config = {};
  try { config = JSON.parse(button.dataset.calConfig || '{}'); } catch (e) { config = {}; }
  window.Cal('modal', { calLink: button.dataset.calBooking, config: config });
}

function openInNewTab(button) {
  // Sin 'noopener' en window.open, porque con él siempre devuelve null;
  // se corta el enlace con esta página a mano.
  const win = window.open(button.href, '_blank');
  if (win) {
    win.opener = null;
  } else {
    // El navegador ha bloqueado la pestaña nueva: abrimos cal.com en esta misma
    window.location.href = button.href;
  }
}

function setLoading(button, isLoading) {
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = 'Cargando…';
    button.setAttribute('aria-busy', 'true');
  } else if (button.dataset.originalText !== undefined) {
    button.textContent = button.dataset.originalText;
    delete button.dataset.originalText;
    button.removeAttribute('aria-busy');
  }
}

function onCalReady() {
  if (calState !== 'loading') return;
  calState = 'ready';
  clearTimeout(timeoutId);
  if (pendingButton) {
    setLoading(pendingButton, false);
    openModal(pendingButton);
    pendingButton = null;
  }
}

function onCalFailed() {
  if (calState !== 'loading') return;
  calState = 'failed';
  clearTimeout(timeoutId);
  if (pendingButton) {
    setLoading(pendingButton, false);
    openInNewTab(pendingButton);
    pendingButton = null;
  }
}

document.addEventListener('click', (e) => {
  const button = e.target.closest('[data-cal-booking]');
  if (!button) return;

  // Con Cal.com caído, dejamos que el enlace abra cal.com como siempre
  if (calState === 'failed') return;

  e.preventDefault();

  if (calState === 'ready') {
    openModal(button);
    return;
  }

  if (pendingButton && pendingButton !== button) {
    setLoading(pendingButton, false);
  }
  if (pendingButton !== button) {
    pendingButton = button;
    setLoading(button, true);
  }

  if (calState === 'idle') {
    calState = 'loading';
    loadCalEmbed();
  }
});
