document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initSmoothScroll();
    initSectionAnimations();
    // initHeroParallax(); // Mantener si la función existe pero está en desuso temporalmente
    initServiceCardHoverEffects();
    initDynamicCopyrightYear();
    // initChatbotButton(); // COMENTADA/ELIMINADA: La llamada al chatbot anterior
    initBackToTopButton(); // Asegúrate de que esta función también sea llamada

    // Lógica para inyectar y configurar el widget de ElevenLabs Convai
    const ELEVENLABS_AGENT_ID = 'agent_3001k116cv39fpev8b49k14064ak'; // Tu ID de agente real

    function injectElevenLabsWidget() {
        // Verifica si el widget ya está cargado para evitar duplicados
        if (document.getElementById(`elevenlabs-convai-widget-${ELEVENLABS_AGENT_ID}`)) {
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
        script.async = true;
        script.type = 'text/javascript';
        document.head.appendChild(script);

        // Crear el contenedor y el widget
        const wrapper = document.createElement('div');
        wrapper.className = 'elevenlabs-widget-wrapper'; // Clase para posibles estilos adicionales
        wrapper.style.position = 'fixed';
        wrapper.style.bottom = '20px'; // Ajusta la posición si es necesario
        wrapper.style.right = '20px'; // Ajusta la posición si es necesario
        wrapper.style.zIndex = '1000'; // Asegura que esté por encima de otros elementos

        const widget = document.createElement('elevenlabs-convai');
        widget.id = `elevenlabs-convai-widget-${ELEVENLABS_AGENT_ID}`;
        widget.setAttribute('agent-id', ELEVENLABS_AGENT_ID);
        // La variante ('full' o 'expandable') se establecerá dinámicamente
        // Los colores se establecerán dinámicamente

        // Setear colores iniciales y variante basado en el tema actual y dispositivo
        updateWidgetColors(widget);
        updateWidgetVariant(widget);

        // Observar cambios de tema (dark-mode) y eventos de redimensionamiento
        const observer = new MutationObserver(() => {
            updateWidgetColors(widget);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        window.addEventListener('resize', () => {
            updateWidgetVariant(widget);
        });

        function updateWidgetVariant(w) {
            const isMobile = window.innerWidth <= 768; // Ajusta este breakpoint si es necesario
            if (isMobile) {
                w.setAttribute('variant', 'expandable'); // Botón flotante y se expande
            } else {
                w.setAttribute('variant', 'full'); // Ventana de chat completa
            }
        }

        function updateWidgetColors(w) {
            // Adaptar estos colores a las variables CSS de tu `style.css`
            const isDarkMode = document.body.classList.contains('dark-mode');
            const rootStyles = getComputedStyle(document.documentElement);

            // Colores basados en tu style.css
            const primaryColor = rootStyles.getPropertyValue('--color-primary').trim(); // #1087c9
            const textLightModeMuted = rootStyles.getPropertyValue('--color-text-muted').trim(); // rgba(27, 34, 31, 0.7)
            const textDarkMode = rootStyles.getPropertyValue('--color-text').trim(); // #F6F5F4 en dark mode

            w.setAttribute('avatar-orb-color-1', primaryColor); // Azul principal
            if (isDarkMode) {
                w.setAttribute('avatar-orb-color-2', textDarkMode); // Blanco/gris claro en dark mode
            } else {
                w.setAttribute('avatar-orb-color-2', textLightModeMuted); // Gris oscuro semi-transparente en light mode
            }
        }

        // Escuchar el evento "call" del widget para inyectar herramientas del cliente
        widget.addEventListener('elevenlabs-convai:call', (event) => {
            event.detail.config.clientTools = {
                // Aquí defines las funciones JavaScript que corresponden a tus "Tools" en ElevenLabs
                redirectToServices: () => {
                    window.location.href = '#services'; // Redirige a la sección de servicios
                },
                redirectToContactForm: () => {
                    window.location.href = '#contact'; // Redirige al formulario de contacto
                },
                // Ejemplo de integración con tu n8n existente
                // Asegúrate de que la URL y la autenticación sean correctas y seguras
                askN8NForSpecificInfo: async ({ query }) => {
                    console.log('Solicitando información a n8n para:', query);
                    try {
                        const n8nWebhookUrl = 'https://n8n.systemsipe.com/webhook/97bc8e92-93b9-40ba-adb0-9b49952264a5'; // TU URL REAL DE N8N
                        const response = await fetch(n8nWebhookUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                // 'Authorization': 'Bearer TU_API_KEY_N8N_O_OTRO_TOKEN_SECRETO' // Si tu n8n requiere autenticación
                            },
                            body: JSON.stringify({ userQuery: query })
                        });
                        const data = await response.json();
                        console.log('Respuesta de n8n:', data);
                        // Dependiendo de cómo quieres que el agente "use" la respuesta de n8n,
                        // la lógica aquí podría necesitar más refinamiento en el lado de ElevenLabs.
                        // Esto podría ser un retorno directo o simplemente una acción que no devuelve nada.
                        return { message: data.botResponse || "No pude obtener una respuesta específica de n8n." };
                    } catch (error) {
                        console.error('Error al contactar n8n:', error);
                        return { message: "Lo siento, hubo un problema al intentar obtener esa información en este momento." };
                    }
                },
                // Añade aquí todas las demás herramientas que hayas definido en ElevenLabs
            };
        });

        // Añadir el wrapper con el widget al DOM
        wrapper.appendChild(widget);
        document.body.appendChild(wrapper);
    }

    // Llama a la función de inyección del widget cuando el DOM esté listo
    injectElevenLabsWidget();

});

function initDarkMode() {
    const toggle = document.getElementById('toggle-dark');
    const prefersDark = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (prefersDark) {
        document.body.classList.add('dark-mode');
        if (toggle) toggle.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        if (toggle) toggle.textContent = '🌙';
    }

    if (toggle) {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            toggle.textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

function initSectionAnimations() {
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.remove('hidden-slide');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('hidden-slide');
        observer.observe(section);
    });
}

function initServiceCardHoverEffects() {
    const serviceCards = document.querySelectorAll('.service-card');
    const rootStyles = getComputedStyle(document.documentElement);
    const shadowBase = rootStyles.getPropertyValue('--shadow-base').trim() || 'rgba(0, 0, 0, 0.08)';
    const shadowAccent = rootStyles.getPropertyValue('--shadow-accent').trim() || 'rgba(16, 135, 201, 0.2)';
    const shadowFocusHover = rootStyles.getPropertyValue('--shadow-focus-hover').trim() || 'rgba(16, 135, 201, 0.4)';
    const transition = rootStyles.getPropertyValue('--transition').trim() || '0.3s cubic-bezier(0.4, 0, 0.2, 1)';

    serviceCards.forEach(card => {
        card.style.transition = `transform ${transition}, box-shadow ${transition}`;

        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
            card.style.boxShadow = `0 10px 20px ${shadowAccent}`;
        });

        card.addEventListener('mouseleave', () => {
            if (!card.matches(':focus-within')) {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = `0 5px 15px ${shadowBase}`;
            }
        });

        card.addEventListener('focusin', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
            card.style.boxShadow = `0 12px 25px ${shadowFocusHover}`;
        });

        card.addEventListener('focusout', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = `0 5px 15px ${shadowBase}`;
        });
    });
}

function initDynamicCopyrightYear() {
    const yearSpan = document.querySelector('footer p');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.textContent = `© ${currentYear} Smart Global Tech. All rights reserved.`;
    }
}

function initBackToTopButton() {
    let backToTopButton = document.querySelector('.back-to-top');
    if (!backToTopButton) {
        backToTopButton = document.createElement('button');
        backToTopButton.textContent = '⬆️';
        backToTopButton.classList.add('back-to-top');
        backToTopButton.setAttribute('aria-label', 'Volver arriba');
        document.body.appendChild(backToTopButton);
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}