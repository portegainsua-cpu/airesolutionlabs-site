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
        menuToggle.addEventListener('click', () => {
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

    // 3. Enlaces activos dinámicos según el scroll
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Si el scroll está en la sección (ajustado por la cabecera de 70px)
            if (window.scrollY >= (sectionTop - 80)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    // Fallback: Disparador manual para los botones de Cal.com si el cargador automático falla
    const calButtons = document.querySelectorAll('[data-cal-link]');
    calButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const calLink = btn.getAttribute('data-cal-link');
            if (window.Cal) {
                window.Cal("modal", {
                    calLink: calLink,
                    config: {
                        layout: "month_view"
                    }
                });
            }
        });
    });

    // 4. Formulario de Contacto (Simulación)
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Previene la recarga de página convencional
            
            // Obtenemos los campos
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            // Capturamos los datos
            const formData = {
                name: nameInput.value,
                email: emailInput.value,
                message: messageInput.value
            };
            
            // Simulación de envío exitoso
            const submitBtn = document.getElementById('form-submit-btn');
            const originalBtnText = submitBtn.innerText;
            
            submitBtn.innerText = 'Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Mensaje de éxito
                alert(`¡Gracias, ${formData.name}! Hemos recibido tu mensaje. Nos pondremos en contacto contigo en info@airesolutionlabs.com.`);
                
                // Limpiamos los campos
                contactForm.reset();
                
                // Restablecemos el botón
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
});

// 5. Integración del Widget de Reservas Cal.com (Modal)
(function (C, A, L) {
    var p = function (a, ar) { a.q.push(ar); };
    var c = C.document; C.Cal = C.Cal || function () {
        var a = C.Cal; if (!a.loaded) {
            a.q = []; a.loaded = true; var s = c.createElement("script"); s.src = "https://app.cal.com/embed/embed.js";
            var h = c.getElementsByTagName("head")[0]; h.appendChild(s);
        } p(a, arguments);
    };
})(window, window.Cal);

Cal("init", {origin:"https://app.cal.com"});
Cal("ui", {
    "styles": {
        "branding": {
            "brandColor": "#0A192F"
        }
    },
    "hideEventTypeDetails": false,
    "layout": "month_view"
});
