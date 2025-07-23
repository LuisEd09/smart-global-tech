document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initSmoothScroll();
  initSectionAnimations();
  // initHeroParallax(); // Esta línea sigue comentada para no activar el parallax
  initServiceCardHoverEffects();
  initDynamicCopyrightYear(); // Nuevo: Inicializa el año del copyright
  initBackToTopButton(); // Nuevo: Inicializa el botón "Volver arriba"
});

function initDarkMode() {
  const toggle = document.getElementById('toggle-dark');
  const prefersDark = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (prefersDark) {
    document.body.classList.add('dark-mode');
    toggle.textContent = '☀️'; // Icono para modo claro cuando ya está en oscuro
  } else {
    toggle.textContent = '🌙'; // Icono para modo oscuro cuando ya está en claro
  }

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    toggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

function initSmoothScroll() {
  // MODIFICADO: Ahora selecciona todos los enlaces que empiezan con #, no solo los de la navegación
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        // Usa scrollIntoView para un desplazamiento suave
        target.scrollIntoView({ behavior: 'smooth' });

        // Opcional: Para ajustar el scroll-margin-top si tienes un header fijo
        // Puedes definir un 'scroll-margin-top' en tu CSS para tus secciones
        // Ejemplo: scroll-margin-top: 100px; en .section
      }
    });
  });
}

// Enhanced Section Animation: Fade in and slide up
function initSectionAnimations() {
  const sections = document.querySelectorAll('.section');
  const options = { threshold: 0.1 }; // Umbral más bajo para activar antes

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Dejar de observar una vez que ha aparecido
      }
    });
  }, options);

  sections.forEach(section => {
    // Añade la clase 'hidden-slide' para el estado inicial de la animación
    section.classList.add('hidden-slide');
    observer.observe(section);
  });
}

// La función Hero Parallax permanece definida pero no es llamada por document.DOMContentLoaded
function initHeroParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    const parallaxAmount = scrollPosition * 0.4;
    hero.style.transform = `translateY(${parallaxAmount}px)`;
  });
}

// New: Service Card Hover Effects using JavaScript (para mayor control y consistencia con CSS variables)
function initServiceCardHoverEffects() {
  const serviceCards = document.querySelectorAll('.service-card');

  // Obtener los valores de las variables CSS
  // Asegúrate de que estos nombres de variables coincidan con tu style.css
  const shadowBase = getComputedStyle(document.documentElement).getPropertyValue('--shadow-base').trim();
  const shadowFocusHover = getComputedStyle(document.documentElement).getPropertyValue('--shadow-focus-hover').trim();
  const cardTransition = getComputedStyle(document.documentElement).getPropertyValue('--transition').trim();

  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Usamos el valor de la variable CSS para la sombra en hover
      card.style.transition = `transform ${cardTransition}, box-shadow ${cardTransition}`;
      card.style.transform = 'translateY(-10px) scale(1.02)';
      card.style.boxShadow = `0 20px 40px ${shadowFocusHover}`; // Sombra más pronunciada
    });

    card.addEventListener('mouseleave', () => {
      // Usamos el valor de la variable CSS para la sombra original/base
      card.style.transform = 'translateY(0) scale(1)';
      card.style.boxShadow = `0 5px 15px ${shadowBase}`; // Sombra original
    });
    
    // Añadir focus para accesibilidad de navegación por teclado
    card.addEventListener('focusin', () => {
      card.style.transition = `transform ${cardTransition}, box-shadow ${cardTransition}`;
      card.style.transform = 'translateY(-10px) scale(1.02)';
      card.style.boxShadow = `0 20px 40px ${shadowFocusHover}`;
    });

    card.addEventListener('focusout', () => {
      card.style.transform = 'translateY(0) scale(1)';
      card.style.boxShadow = `0 5px 15px ${shadowBase}`;
    });
  });
}

// NUEVA FUNCIÓN: Actualiza dinámicamente el año del copyright en el pie de página
function initDynamicCopyrightYear() {
  const yearSpan = document.querySelector('footer p'); // Asume que el año está dentro de una etiqueta <p> en el footer
  if (yearSpan) {
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = `© ${currentYear} Smart Global Tech. All rights reserved.`;
  }
}

// NUEVA FUNCIÓN: Botón "Volver arriba"
function initBackToTopButton() {
  const backToTopButton = document.createElement('button');
  backToTopButton.textContent = '⬆️'; // Puedes usar un SVG o un ícono de fuente aquí
  backToTopButton.classList.add('back-to-top'); // Añade una clase para estilos CSS
  backToTopButton.setAttribute('aria-label', 'Volver arriba');
  document.body.appendChild(backToTopButton);

  // Muestra u oculta el botón basado en el scroll
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) { // Muestra el botón después de 300px de scroll
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
  });

  // Smooth scroll al hacer clic en el botón
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}