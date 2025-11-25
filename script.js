// UI interactions and form submission

document.addEventListener('DOMContentLoaded', () => {
  if (typeof translations !== 'undefined') {
    initLanguage();
  } else {
    console.error('translations.js no cargó correctamente.');
  }

  initDarkMode();
  initSmoothScroll();
  initServiceAccordion();
  initBackToTopButton();
  initNavHighlighting();
  initDynamicCopyrightYear();
  injectElevenLabsWidget();
  initContactFormSubmission();
  initRevealAnimations();
});

// --- Internacionalización (ES/EN) ---
function initLanguage() {
  const languageSelector = document.getElementById('language-selector');
  if (!languageSelector) return;

  const supportedLanguages = ['es', 'en'];
  const defaultLang = 'es';

  const setLanguage = (lang) => {
    const langToSet = supportedLanguages.includes(lang) ? lang : defaultLang;
    document.documentElement.lang = langToSet;
    localStorage.setItem('language', langToSet);
    languageSelector.value = langToSet;

    document.querySelectorAll('[data-key]').forEach((element) => {
      const key = element.getAttribute('data-key');
      if (translations[key] && translations[key][langToSet]) {
        element.innerHTML = translations[key][langToSet];
      }
    });
  };

  languageSelector.addEventListener('change', (e) => setLanguage(e.target.value));

  const savedLang = localStorage.getItem('language');
  const browserLang = navigator.language?.substring(0, 2) || defaultLang;

  if (savedLang && supportedLanguages.includes(savedLang)) {
    setLanguage(savedLang);
  } else if (supportedLanguages.includes(browserLang)) {
    setLanguage(browserLang);
  } else {
    setLanguage(defaultLang);
  }
}

// --- Tema claro/oscuro ---
function initDarkMode() {
  const toggle = document.getElementById('toggle-dark');
  if (!toggle) return;

  const applyTheme = (isDark) => {
    document.body.classList.toggle('dark-mode', isDark);
    toggle.textContent = isDark ? '??' : '?';
  };

  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialDark = storedTheme ? storedTheme === 'dark' : false || prefersDark === true ? false : false;
  // Default: claro; solo aplica dark si el usuario lo guardó
  applyTheme(storedTheme === 'dark');

  toggle.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    applyTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// --- Desplazamiento suave ---
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
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

// --- Acordeón de servicios ---
function initServiceAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach((item) => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      accordionItems.forEach((other) => {
        other.classList.remove('active');
        const otherContent = other.querySelector('.accordion-content');
        if (otherContent) otherContent.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

// --- Botón volver arriba ---
function initBackToTopButton() {
  const backToTopButton = document.querySelector('.back-to-top');
  if (!backToTopButton) return;
  window.addEventListener('scroll', () => {
    backToTopButton.classList.toggle('show', window.scrollY > 280);
  });
  backToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// --- Resaltado del menú ---
function initNavHighlighting() {
  const sections = document.querySelectorAll('main > section[id]');
  const navLinks = document.querySelectorAll('header nav a');

  const observerOptions = {
    root: null,
    rootMargin: '-45% 0px -45% 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active-link');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

// --- Año dinámico ---
function initDynamicCopyrightYear() {
  const yearElement = document.querySelector('[data-key="footer_copyright"]');
  if (yearElement) {
    const currentYear = new Date().getFullYear();
    if (!yearElement.innerHTML.includes(currentYear)) {
      yearElement.innerHTML = yearElement.innerHTML.replace('2025', currentYear);
    }
  }
}

// --- Animaciones de aparición ---
function initRevealAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((el) => observer.observe(el));
}

// --- Widget de ElevenLabs ---
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
  wrapper.style.zIndex = '9000';

  const widget = document.createElement('elevenlabs-convai');
  widget.id = `elevenlabs-convai-widget-${ELEVENLABS_AGENT_ID}`;
  widget.setAttribute('agent-id', ELEVENLABS_AGENT_ID);

  updateWidgetColors(widget);
  updateWidgetVariant(widget);

  const observer = new MutationObserver(() => updateWidgetColors(widget));
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('resize', () => updateWidgetVariant(widget));

  function updateWidgetVariant(w) {
    w.setAttribute('variant', window.innerWidth <= 768 ? 'expandable' : 'full');
  }

  function updateWidgetColors(w) {
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryColor = rootStyles.getPropertyValue('--color-primary').trim();
    const textColor = document.body.classList.contains('dark-mode') ? '#F6F5F4' : '#1B221F';
    w.setAttribute('avatar-orb-color-1', primaryColor);
    w.setAttribute('avatar-orb-color-2', textColor);
  }

  widget.addEventListener('elevenlabs-convai:call', (event) => {
    event.detail.config.clientTools = {
      redirectToServices: () => (window.location.href = '#services'),
      redirectToContactForm: () => (window.location.href = '#contact'),
    };
  });

  wrapper.appendChild(widget);
  document.body.appendChild(wrapper);
}

// --- Envío de formulario ---
function initContactFormSubmission() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const phoneInput = document.getElementById('phone');
  const iti = window.intlTelInput(phoneInput, {
    initialCountry: 'mx',
    preferredCountries: ['mx', 'co', 'cl', 'us', 'ca'],
    utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
  });

  let isSubmitting = false;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const fullPhoneNumber = iti.getNumber();
    if (!iti.isValidNumber()) {
      alert('Por favor, introduce un número de teléfono válido.');
      return;
    }

    isSubmitting = true;
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    const formData = new FormData(form);
    const data = {
      nombre: formData.get('name'),
      email: formData.get('email'),
      servicio: formData.get('service'),
      mensaje: formData.get('message'),
      company: formData.get('company'),
      phone: fullPhoneNumber,
    };

    try {
      const response = await fetch('http://localhost:3000/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        window.location.href = 'thankyou.html';
      } else {
        alert(result.message || 'Ocurrió un problema. Intenta más tarde.');
      }
    } catch (error) {
      console.error('Error de red o del servidor:', error);
      alert('Ocurrió un problema de conexión. Intenta más tarde.');
    } finally {
      isSubmitting = false;
      submitButton.disabled = false;
    }
  });
}
