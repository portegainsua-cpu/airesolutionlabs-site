/**
 * AI Resolution Labs - Sitio Web Corporativo
 * JavaScript para interactividad básica y experiencia de usuario minimalista.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Menú Móvil (Hamburguesa)
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en cualquier enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // 2. Efecto de cabecera al hacer scroll
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Enlaces activos dinámicos según el scroll (y barra deslizante)
    const sections = document.querySelectorAll('section');
    const menuLinks = document.querySelectorAll('.nav-link:not(.nav-btn)');
    const menuUl = document.querySelector('.nav-menu ul');

    // Creamos dinámicamente el indicador de línea
    const indicator = document.createElement('div');
    indicator.classList.add('nav-indicator');
    menuUl.appendChild(indicator);

    function updateIndicator() {
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) {
            const linkRect = activeLink.getBoundingClientRect();
            const ulRect = menuUl.getBoundingClientRect();
            indicator.style.width = `${linkRect.width}px`;
            indicator.style.left = `${linkRect.left - ulRect.left}px`;
            indicator.style.opacity = '1';
        } else {
            indicator.style.opacity = '0';
        }
    }

    // Usamos IntersectionObserver para una transición súper fluida y precisa al hacer scroll
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -50% 0px', // Detecta la sección cuando está en el centro de la pantalla
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Evitamos activar si es la sección de contacto (ya que Hablemos es un botón de Cal.com)
                if (id === 'contacto') return;

                menuLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
                updateIndicator();
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Ejecutar al cargar la página para posicionar el indicador en "Inicio"
    setTimeout(updateIndicator, 100);

    // Ajustar si la ventana cambia de tamaño
    window.addEventListener('resize', updateIndicator);

    // 4. Formulario de contacto: Cloudflare Turnstile y envío al Apps Script de los formularios
    // (el mismo que usa la tarjeta). La validación de verdad la hace el servidor; esta ayuda a quien rellena.
    const FORM_AJUSTES = {
        // URL de la aplicación web de Apps Script (es pública; la protección está en el servidor)
        ENDPOINT: 'https://script.google.com/macros/s/AKfycbzCgaigJtDxVea-eIOW5tq_OZKyM_AU4Bv7mUer4SZhgpuEOlUX0wJQLEbWa500PQMFIg/exec',
        // Clave del sitio de Turnstile (es pública). Clave de prueba: 1x00000000000000000000AA
        TURNSTILE_SITEKEY: '0x4AAAAAAFIFiqOfy6ts7wC6',
        VERSION_TEXTO_LEGAL: '2026-10-05',
        TIEMPO_MAXIMO_MS: 25000,
        EMAIL_CONTACTO: 'info@airesolutionlabs.com'
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

    // Mensaje de resultado bajo el botón (aria-live), en lugar de alert()
    function showFormStatus(text, isError) {
        if (!formStatus) return;
        formStatus.textContent = text;
        formStatus.classList.toggle('text-red-500', isError);
        formStatus.classList.toggle('text-purple-400', !isError);
        formStatus.hidden = false;
    }

    function hideFormStatus() {
        if (formStatus) formStatus.hidden = true;
    }

    // Campos que valida el servidor: nombre del campo en el Apps Script → campo del formulario
    const CAMPOS = {
        nombre: { id: 'name', etiqueta: 'Nombre completo', msg: 'escribe tu nombre (entre 2 y 80 caracteres).' },
        email: { id: 'email', etiqueta: 'Correo electrónico', msg: 'escribe un correo electrónico válido.' },
        mensaje: { id: 'message', etiqueta: '¿En qué te podemos ayudar?', msg: 'cuéntanos tu consulta (entre 10 y 2.000 caracteres).' },
        privacidad: { id: 'privacy-agreement', etiqueta: 'Política de Privacidad', msg: 'marca la casilla para confirmar que la has leído.' }
    };

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

    function marcarErrores(campos) {
        Object.keys(CAMPOS).forEach((c) => {
            const el = document.getElementById(CAMPOS[c].id);
            if (el) el.removeAttribute('aria-invalid');
        });
        if (!campos.length) return;
        const conocidos = campos.filter((c) => CAMPOS[c]);
        if (!conocidos.length) {
            showFormStatus('Revisa los datos del formulario e inténtalo de nuevo.', true);
            return;
        }
        conocidos.forEach((c) => document.getElementById(CAMPOS[c].id).setAttribute('aria-invalid', 'true'));
        showFormStatus(conocidos.map((c) => `Revisa «${CAMPOS[c].etiqueta}»: ${CAMPOS[c].msg}`).join(' '), true);
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
                theme: 'dark',
                language: 'es',
                appearance: 'interaction-only',
                callback: (tok) => { ts.fallo = false; resolverToken(tok); },
                'expired-callback': () => { ts.token = ''; },
                'error-callback': () => { ts.fallo = true; resolverToken(''); return true; }
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
            cargarTurnstile();

            const datos = {
                nombre: limpiar(document.getElementById('name').value),
                email: limpiar(document.getElementById('email').value).toLowerCase(),
                mensaje: document.getElementById('message').value.trim()
            };
            const errores = erroresLocales(datos, document.getElementById('privacy-agreement').checked);
            if (errores.length) {
                marcarErrores(errores);
                return;
            }
            marcarErrores([]);

            ocupado(true, 'Enviando...');
            obtenerToken(12000).then((token) => {
                if (!token) {
                    ocupado(false);
                    showFormStatus(`No se ha podido completar la verificación antispam (puede que un bloqueador la esté impidiendo). Escríbenos a ${FORM_AJUSTES.EMAIL_CONTACTO}.`, true);
                    return null;
                }
                // Apps Script tarda unos segundos en responder: se avisa para que nadie pulse dos veces
                ocupado(true, 'Un momento, lo estoy registrando...');
                const cuerpo = {
                    formulario: 'contacto',
                    datos: datos,
                    consentimientos: {
                        privacidad: true,
                        comunicaciones: false,
                        version_texto: FORM_AJUSTES.VERSION_TEXTO_LEGAL
                    },
                    turnstile: token,
                    web_empresa: contactForm.elements.web_empresa ? contactForm.elements.web_empresa.value : '',
                    t_relleno: Date.now() - tInicio,
                    referido: ''
                };
                const ctrl = 'AbortController' in window ? new AbortController() : null;
                const temporizador = setTimeout(() => { if (ctrl) ctrl.abort(); }, FORM_AJUSTES.TIEMPO_MAXIMO_MS);
                return fetch(FORM_AJUSTES.ENDPOINT, {
                    method: 'POST',
                    // text/plain evita la petición previa de CORS que Apps Script no admite
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify(cuerpo),
                    redirect: 'follow',
                    signal: ctrl ? ctrl.signal : undefined
                }).then((res) => {
                    clearTimeout(temporizador);
                    return res.json();
                }).then((r) => {
                    ocupado(false);
                    reiniciarTurnstile();
                    if (r && r.ok) {
                        showFormStatus(`¡Gracias, ${datos.nombre}! Hemos recibido tu mensaje y te responderemos al correo que nos has indicado.`, false);
                        contactForm.reset();
                    } else if (r && r.error === 'validacion' && r.campos) {
                        marcarErrores(r.campos);
                    } else if (r && r.error === 'limite') {
                        showFormStatus('Has enviado varios mensajes seguidos. Espera un rato antes de volver a intentarlo.', true);
                    } else if (r && r.error === 'verificacion') {
                        showFormStatus('No se ha podido verificar el envío. Vuelve a pulsar el botón.', true);
                    } else {
                        showFormStatus(`No hemos podido enviar tu mensaje. Inténtalo de nuevo o escríbenos a ${FORM_AJUSTES.EMAIL_CONTACTO}.`, true);
                    }
                });
            }).catch((error) => {
                console.error('Error al enviar formulario:', error);
                ocupado(false);
                reiniciarTurnstile();
                showFormStatus(`No hemos podido enviar tu mensaje. Inténtalo de nuevo o escríbenos a ${FORM_AJUSTES.EMAIL_CONTACTO}.`, true);
            });
        });
    }
    // 6. Tarjetas de servicios interactivas en la sección Hero (Línea de Conexión)
    const techCards = document.querySelectorAll('.tech-card');
    if (techCards.length > 0) {
        const handleCardActive = (selectedCard) => {
            techCards.forEach(card => {
                card.classList.remove('active');
            });
            selectedCard.classList.add('active');
        };

        techCards.forEach(card => {
            // Al pasar el cursor por encima (PC)
            card.addEventListener('mouseenter', () => {
                handleCardActive(card);
            });
            // Al hacer clic o tocar (Móvil / Tablet)
            card.addEventListener('click', () => {
                handleCardActive(card);
            });
        });
    }

    // 7. Resplandor dinámico del cursor (Sincronizado con la tarjeta de visita)
    const mouseGlow = document.getElementById('mouse-glow');
    if (mouseGlow && window.innerWidth > 640) {
        window.addEventListener('mousemove', (e) => {
            mouseGlow.style.left = `${e.clientX}px`;
            mouseGlow.style.top = `${e.clientY}px`;
        });
    }
});

// 5. Reservas con Cal.com (modal)
// embed.js se descarga solo al pulsar un botón de reserva. Mientras carga, el botón
// muestra "Cargando…"; si no está listo en 5 segundos, se abre cal.com en una pestaña nueva.
// Los botones usan data-cal-booking (y no data-cal-link) para que el propio embed.js
// no abra un segundo modal con su escucha de clics.
(function () {
    const CAL_EMBED_URL = 'https://app.cal.com/embed/embed.js';
    const LOAD_TIMEOUT_MS = 5000;
    let calState = 'idle'; // idle | loading | ready | failed
    let pendingButton = null;
    let timeoutId = null;

    function loadCalEmbed() {
        timeoutId = setTimeout(onCalFailed, LOAD_TIMEOUT_MS);

        // Fragmento oficial de Cal.com (incluye Cal.ns, que faltaba en la versión anterior)
        (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, CAL_EMBED_URL, "init");

        Cal("init", { origin: "https://app.cal.com" });
        Cal("ui", {
            "styles": { "branding": { "brandColor": "#0A192F" } },
            "hideEventTypeDetails": false,
            "layout": "month_view"
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
        Cal('modal', { calLink: button.dataset.calBooking, config: config });
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
})();
