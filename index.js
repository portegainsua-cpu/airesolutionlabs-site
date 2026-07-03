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
            indicator.style.width = `${activeLink.offsetWidth}px`;
            indicator.style.left = `${activeLink.offsetLeft}px`;
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
