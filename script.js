/* Archivo script.js - Versión con resaltado de menú */

document.addEventListener('DOMContentLoaded', () => {
    if (typeof translations !== 'undefined') {
        initLanguage();
    } else {
        console.error("El archivo translations.js no se cargó o está vacío.");
    }
    
    initDarkMode();
    initSmoothScroll();
    initServiceAccordion();
    initBackToTopButton();
    initNavHighlighting(); // <-- NUEVA FUNCIÓN AÑADIDA
    
    injectElevenLabsWidget();
});


// --- LÓGICA DE INTERNACIONALIZACIÓN (i18n) ---
function initLanguage() {
    const languageSelector = document.getElementById('language-selector');
    if (!languageSelector) return;

    const setLanguage = (lang) => {
        document.documentElement.lang = lang;
        localStorage.setItem('language', lang);
        languageSelector.value = lang;

        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[key] && translations[key][lang]) {
                element.innerHTML = translations[key][lang];
            }
        });
        initDynamicCopyrightYear(); // Actualizar año después de cambiar idioma
    };

    languageSelector.addEventListener('change', (e) => setLanguage(e.target.value));

    const savedLang = localStorage.getItem('language');
    const browserLang = navigator.language.substring(0, 2);

    if (savedLang) {
        setLanguage(savedLang);
    } else if (['en', 'es', 'fr'].includes(browserLang)) {
        setLanguage(browserLang);
    } else {
        setLanguage('en');
    }
}

// --- NUEVA FUNCIÓN PARA RESALTAR EL MENÚ ---
function initNavHighlighting() {
    const sections = document.querySelectorAll('main > section[id]');
    const navLinks = document.querySelectorAll('header nav a');

    const observerOptions = {
        root: null, // Relativo al viewport
        rootMargin: '-50% 0px -50% 0px', // Se activa cuando la sección está en el centro vertical
        threshold: 0
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}


// --- LÓGICA DE INTERACCIÓN DE LA PÁGINA (EXISTENTE) ---

function initServiceAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    if (!accordionItems.length) return;

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        if (!header || !content) return;

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                item.classList.remove('active');
                content.style.maxHeight = null;
            }
        });
    });
}

function initDarkMode() {
    const toggle = document.getElementById('toggle-dark');
    if (!toggle) return;
    const prefersDark = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    const applyTheme = (isDark) => {
        if (isDark) {
            document.body.classList.add('dark-mode');
            toggle.textContent = '☀️';
        } else {
            document.body.classList.remove('dark-mode');
            toggle.textContent = '🌙';
        }
    }
    applyTheme(prefersDark);
    toggle.addEventListener('click', () => {
        const isDark = !document.body.classList.contains('dark-mode');
        applyTheme(isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

function initBackToTopButton() {
    const backToTopButton = document.querySelector('.back-to-top');
    if (!backToTopButton) return;
    window.addEventListener('scroll', () => {
        backToTopButton.classList.toggle('show', window.scrollY > 300);
    });
    backToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initDynamicCopyrightYear() {
    const yearElement = document.querySelector('[data-key="footer_copyright"]');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2025', currentYear);
    }
}

// --- LÓGICA DEL CHATBOT DE ELEVENLABS (SIN MODIFICAR) ---
function injectElevenLabsWidget() {
    const ELEVENLABS_AGENT_ID = 'agent_3001k116cv39fpev8b49k14064ak';
    if (document.getElementById(`elevenlabs-convai-widget-${ELEVENLABS_AGENT_ID}`)) return;
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    document.head.appendChild(script);
    const wrapper = document.createElement('div');
    wrapper.className = 'elevenlabs-widget-wrapper';
    wrapper.style.position = 'fixed';
    wrapper.style.bottom = '20px';
    wrapper.style.right = '20px';
    wrapper.style.zIndex = '1000';
    const widget = document.createElement('elevenlabs-convai');
    widget.id = `elevenlabs-convai-widget-${ELEVENLABS_AGENT_ID}`;
    widget.setAttribute('agent-id', ELEVENLABS_AGENT_ID);
    updateWidgetColors(widget);
    updateWidgetVariant(widget);
    const observer = new MutationObserver(() => updateWidgetColors(widget));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('resize', () => updateWidgetVariant(widget));
    function updateWidgetVariant(w) { w.setAttribute('variant', window.innerWidth <= 768 ? 'expandable' : 'full'); }
    function updateWidgetColors(w) {
        const rootStyles = getComputedStyle(document.documentElement);
        const primaryColor = rootStyles.getPropertyValue('--color-primary').trim();
        const textColor = document.body.classList.contains('dark-mode') ? '#F6F5F4' : '#1B221F';
        w.setAttribute('avatar-orb-color-1', primaryColor);
        w.setAttribute('avatar-orb-color-2', textColor);
    }
    widget.addEventListener('elevenlabs-convai:call', (event) => {
        event.detail.config.clientTools = {
            redirectToServices: () => window.location.href = '#services',
            redirectToContactForm: () => window.location.href = '#contact',
            askN8NForSpecificInfo: async ({ query }) => {
                try {
                    const response = await fetch('https://n8n.systemsipe.com/webhook/97bc8e92-93b9-40ba-adb0-9b49952264a5', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userQuery: query })
                    });
                    const data = await response.json();
                    return { message: data.botResponse || "No pude obtener una respuesta específica." };
                } catch (error) {
                    return { message: "Lo siento, hubo un problema al obtener esa información." };
                }
            },
        };
    });
    wrapper.appendChild(widget);
    document.body.appendChild(wrapper);
}