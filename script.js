document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initSmoothScroll();
  initSectionAnimations();
  // initHeroParallax(); // Mantener si la función existe pero está en desuso temporalmente
  initServiceCardHoverEffects();
  initDynamicCopyrightYear();
  initChatbotButton(); // Aquí se inicializa toda la lógica del chatbot
  initBackToTopButton(); // Asegúrate de que esta función también sea llamada
});

function initDarkMode() {
  const toggle = document.getElementById('toggle-dark');
  const prefersDark = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (prefersDark) {
    document.body.classList.add('dark-mode');
    if (toggle) toggle.textContent = '☀️'; // Asegurarse de que el toggle existe
  } else {
    document.body.classList.remove('dark-mode');
    if (toggle) toggle.textContent = '🌙'; // Asegurarse de que el toggle existe
  }

  if (toggle) { // Solo añadir el listener si el toggle existe
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
  // Usar valores predeterminados o una verificación si las variables CSS no existen
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

// NUEVA FUNCIÓN: Botón "Volver arriba" (ya estaba, pero aseguramos su existencia)
function initBackToTopButton() {
    let backToTopButton = document.querySelector('.back-to-top');
    if (!backToTopButton) { // Si el botón no existe, lo creamos
        backToTopButton = document.createElement('button');
        backToTopButton.textContent = '⬆️'; // Puedes usar un SVG o un ícono de fuente aquí
        backToTopButton.classList.add('back-to-top'); // Añade una clase para estilos CSS
        backToTopButton.setAttribute('aria-label', 'Volver arriba');
        document.body.appendChild(backToTopButton);
    }

    // Muestra u oculta el botón basado en el scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Mostrar el botón después de hacer scroll 300px
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


// Lógica para la interfaz del Chatbot (completamente refactorizada e integrada)
function initChatbotButton() {
    const chatbotButton = document.createElement('button');
    // Asegúrate que la imagen tiene fondo transparente para que se vea bien
    chatbotButton.innerHTML = '<img src="images/chatbot_image.png" alt="Chatbot Icon" style="width: 32px; height: 32px;">';
    chatbotButton.classList.add('chatbot-button');
    chatbotButton.setAttribute('aria-label', 'Abrir chatbot de asistencia');
    document.body.appendChild(chatbotButton);

    let chatInterface = null; // Variable para almacenar la interfaz del chat

    // Función para añadir mensajes al chat
    function addMessage(sender, message) {
        // Asegurarse de que chatInterface y chatbotBody existen antes de añadir mensajes
        if (!chatInterface) return;
        const chatbotBody = chatInterface.querySelector('.chatbot-body');
        if (!chatbotBody) return;

        const messageElement = document.createElement('div');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        messageElement.textContent = message;
        chatbotBody.appendChild(messageElement);
        // Scroll automático al último mensaje
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    // Manejar el envío de mensajes
    const sendMessage = () => {
        if (!chatInterface) return; // Asegurarse de que la interfaz existe
        const chatbotInput = chatInterface.querySelector('.chatbot-input');
        const chatbotSendBtn = chatInterface.querySelector('.chatbot-send-btn');

        const message = chatbotInput.value.trim();
        if (message) {
            addMessage('user', message); // Añadir mensaje del usuario
            chatbotInput.value = ''; // Limpiar input

            // Deshabilitar input y botón mientras el bot "piensa"
            chatbotInput.disabled = true;
            chatbotSendBtn.disabled = true;

            // Simular una respuesta del bot (esto será reemplazado por la conexión a n8n)
            setTimeout(() => {
                addMessage('bot', '¡Gracias por tu mensaje! Estoy procesándolo. Pronto te conectaremos con una solución real.');
                // Habilitar input y botón de nuevo
                chatbotInput.disabled = false;
                chatbotSendBtn.disabled = false;
                chatbotInput.focus(); // Volver a enfocar el input
            }, 1500); // Pequeña pausa para simular procesamiento
        }
    };

    chatbotButton.addEventListener('click', () => {
        if (!chatInterface) {
            // Si la interfaz no existe, la creamos la primera vez que se hace clic
            chatInterface = document.createElement('div');
            chatInterface.classList.add('chatbot-interface');
            chatInterface.setAttribute('aria-modal', 'true');
            chatInterface.setAttribute('role', 'dialog');

            chatInterface.innerHTML = `
                <div class="chatbot-header">
                    <h3>Asistente Smart Global Tech</h3>
                    <button class="chatbot-close-btn" aria-label="Cerrar chat">X</button>
                </div>
                <div class="chatbot-body">
                    </div>
                <div class="chatbot-footer">
                    <input type="text" placeholder="Escribe tu mensaje..." class="chatbot-input">
                    <button class="chatbot-send-btn">Enviar</button>
                </div>
            `;
            document.body.appendChild(chatInterface);

            // Obtener referencias a los elementos dentro de la interfaz recién creada
            const chatbotCloseBtn = chatInterface.querySelector('.chatbot-close-btn');
            const chatbotInput = chatInterface.querySelector('.chatbot-input');
            const chatbotSendBtn = chatInterface.querySelector('.chatbot-send-btn');

            // Añadir los Event Listeners a los elementos dentro de la interfaz
            chatbotCloseBtn.addEventListener('click', () => {
                chatInterface.classList.remove('show');
                document.body.classList.remove('chatbot-open'); // Quita la clase del body al cerrar
            });

            chatbotSendBtn.addEventListener('click', sendMessage);

            chatbotInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });

            // Mensaje de bienvenida inicial del bot
            addMessage('bot', '¡Bienvenido! Soy tu asistente virtual de Smart Global Tech. ¿Cómo puedo ayudarte hoy?');

            // Asegurarse de que el input y el botón de enviar están habilitados al inicio
            chatbotInput.disabled = false;
            chatbotSendBtn.disabled = false;
        }

        // Toggle (mostrar/ocultar) la interfaz
        chatInterface.classList.toggle('show');
        document.body.classList.toggle('chatbot-open', chatInterface.classList.contains('show'));

        // Si la interfaz se muestra, enfoca el campo de entrada y desplázate al final
        if (chatInterface.classList.contains('show')) {
            const inputField = chatInterface.querySelector('.chatbot-input');
            inputField.focus();
            const chatbotBody = chatInterface.querySelector('.chatbot-body');
            if (chatbotBody) {
                chatbotBody.scrollTop = chatbotBody.scrollHeight;
            }
        }
    });

    // Event listeners globales para cerrar con Escape y clics fuera de la interfaz
    document.addEventListener('keydown', (e) => {
        if (chatInterface && e.key === 'Escape' && chatInterface.classList.contains('show')) {
            chatInterface.classList.remove('show');
            document.body.classList.remove('chatbot-open');
        }
    });

    document.addEventListener('click', (e) => {
        if (chatInterface && chatInterface.classList.contains('show') && !chatbotButton.contains(e.target) && !chatInterface.contains(e.target)) {
            chatInterface.classList.remove('show');
            document.body.classList.remove('chatbot-open');
        }
    });
}