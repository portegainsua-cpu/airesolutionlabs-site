/**
 * AI Resolution - Sitio Web Corporativo
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

    // 4. Formulario de Contacto (Integrado con Make.com)
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Previene la recarga convencional de la página
            
            // Obtenemos los campos
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const privacyAgreement = document.getElementById('privacy-agreement');
            const submitBtn = document.getElementById('form-submit-btn');
            const originalBtnText = submitBtn.innerText;
            
            // Validación de la casilla de verificación legal
            if (privacyAgreement && !privacyAgreement.checked) {
                let errorMsg = document.getElementById('privacy-error-msg');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.id = 'privacy-error-msg';
                    errorMsg.className = 'text-xs text-red-500 font-semibold mt-2';
                    errorMsg.innerText = 'Es necesario aceptar la Política de Privacidad para agendar la sesión.';
                    privacyAgreement.parentNode.appendChild(errorMsg);
                }
                return;
            } else {
                const errorMsg = document.getElementById('privacy-error-msg');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }

            // Capturamos los datos
            const formData = {
                name: nameInput.value,
                email: emailInput.value,
                message: messageInput.value
            };
            
            // Cambiamos el estado del botón
            submitBtn.innerText = 'Enviando...';
            submitBtn.disabled = true;

            // URL del Webhook de Make.com
            const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/04wzitcmd4d15xnfrq3fpqtodkehlpq7';
            
            // Si la URL sigue siendo el placeholder, simulamos el envío para evitar errores locales
            if (MAKE_WEBHOOK_URL.includes('xxxxxxxx')) {
                setTimeout(() => {
                    alert(`[Simulación] ¡Mensaje recibido, ${formData.name}! (Nota: Debes configurar tu URL de Make.com en index.js para recibirlo por correo de verdad).`);
                    contactForm.reset();
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                }, 1000);
                return;
            }

            // Envío real mediante Fetch API al Webhook de Make usando URL-encoded (evita preflight OPTIONS de CORS)
            fetch(MAKE_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(formData)
            })
            .then(response => {
                if (response.ok) {
                    alert(`¡Gracias, ${formData.name}! Tu mensaje ha sido enviado con éxito. Nos pondremos en contacto contigo en info@airesolutionlabs.com.`);
                    contactForm.reset();
                } else {
                    throw new Error('Error en el servidor de Make');
                }
            })
            .catch(error => {
                console.error('Error al enviar formulario:', error);
                alert('Ups, hubo un problema al enviar tu mensaje. Por favor, escríbenos directamente a info@airesolutionlabs.com.');
            })
            .finally(() => {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
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
