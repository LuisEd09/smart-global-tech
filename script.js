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
        messageElement.textContent = message; // Usar textContent para evitar inyección de HTML y manejar texto plano
        chatbotBody.appendChild(messageElement);
        // Scroll automático al último mensaje
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    // Manejar el envío de mensajes
    const sendMessage = async () => { // Hacemos la función asíncrona para usar await
        if (!chatInterface) return;
        const chatbotInput = chatInterface.querySelector('.chatbot-input');
        const chatbotSendBtn = chatInterface.querySelector('.chatbot-send-btn');

        const message = chatbotInput.value.trim();
        if (message) {
            addMessage('user', message); // Añadir mensaje del usuario
            chatbotInput.value = ''; // Limpiar input

            // Deshabilitar input y botón mientras se envía/espera respuesta
            chatbotInput.disabled = true;
            chatbotSendBtn.disabled = true;

            // ***** INICIO: CAMBIOS PARA LA CONEXIÓN CON N8N *****
            // ¡IMPORTANTE! Asegúrate de que esta URL es la correcta y que tu webhook de n8n está en modo escucha.
            // Esta es la URL de PRODUCCIÓN de tu webhook de n8n
            const n8nWebhookUrl = 'https://n8n.systemsipe.com/webhook/97bc8e92-93b9-40ba-adb0-9b49952264a5';

            try {
                console.log('Intentando enviar mensaje a n8n...');
                const response = await fetch(n8nWebhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: message }), // Enviamos el mensaje del usuario en un objeto JSON
                });

                console.log('Respuesta de fetch recibida. Status:', response.status);

                if (!response.ok) {
                    // Si la respuesta HTTP no es 2xx, leemos el cuerpo como texto y lanzamos un error
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
                }

                // ***** CAMBIO IMPORTANTE AQUÍ: Leer el cuerpo como texto primero *****
                const rawResponseText = await response.text();
                console.log('Respuesta cruda de n8n:', rawResponseText);

                let data;
                try {
                    // Intentar parsear el texto crudo como JSON
                    data = JSON.parse(rawResponseText);
                    console.log('JSON parseado exitosamente:', data);
                } catch (jsonError) {
                    console.error('Error al parsear JSON de la respuesta:', jsonError);
                    // rawResponseText ya está disponible en la consola para depuración
                    throw new Error('Error al procesar la respuesta del bot (JSON inválido).');
                }

                // Acceder a 'data.botResponse' para obtener el texto del mensaje
                if (data && data.botResponse) {
                    addMessage('bot', data.botResponse); // Mostrar la respuesta real de n8n
                } else {
                    // Manejo si la respuesta no tiene la estructura esperada
                    addMessage('bot', 'Gracias por tu mensaje. El asistente no proporcionó una respuesta específica o hubo un problema al procesarla.');
                    console.error('Bot response structure invalid or empty:', data);
                }

            } catch (error) {
                // Este bloque captura cualquier error de red, HTTP o de parseo de JSON
                addMessage('bot', 'No se pudo conectar con el servidor del asistente. Revisa tu conexión o inténtalo de nuevo más tarde.');
                console.error('Error detallado al enviar mensaje a bot:', error);
            } finally {
                // Habilitar input y botón de nuevo, sin importar el resultado
                chatbotInput.disabled = false;
                chatbotSendBtn.disabled = false;
                chatbotInput.focus(); // Volver a enfocar el input
            }
            // ***** FIN: CAMBIOS PARA la CONEXIÓN CON N8N *****
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
            addMessage('bot', '¡Hola! 👋 Soy Inspector IA, tu asistente virtual aquí en Smart Global Tech. Estoy aquí para ayudarte a conocer nuestros servicios, resolver dudas y guiarte. ¿En qué puedo ayudarte hoy?');


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