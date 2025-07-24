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
    chatbotButton.innerHTML = '<img src="images/chatbot_image.png" alt="Chatbot Icon" style="width: 32px; height: 32px;">';
    chatbotButton.classList.add('chatbot-button');
    chatbotButton.setAttribute('aria-label', 'Open assistance chatbot');
    document.body.appendChild(chatbotButton);

    let chatInterface = null;

    // Format bot response: replace \n with line breaks and format numbered bold lists
    function formatBotResponse(text) {
        let formatted = text.replace(/\\n/g, '\n').replace(/\n/g, '<br>');

        // Format numbered bold list items: "1. **Title**" → <li><strong>1. Title</strong></li>
        formatted = formatted.replace(/(\d+)\.\s\*\*(.+?)\*\*/g, '<li><strong>$1. $2</strong></li>');

        if (formatted.includes('<li>')) {
            formatted = '<ul>' + formatted + '</ul>';
        }

        return formatted;
    }

    // Add message to chat (can be HTML for bot)
    function addMessage(sender, message, isHtml = false) {
        if (!chatInterface) return;
        const chatbotBody = chatInterface.querySelector('.chatbot-body');
        if (!chatbotBody) return;

        const messageElement = document.createElement('div');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');

        if (isHtml) {
            messageElement.innerHTML = message;
        } else {
            messageElement.textContent = message;
        }

        chatbotBody.appendChild(messageElement);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    const sendMessage = async () => {
        if (!chatInterface) return;
        const chatbotInput = chatInterface.querySelector('.chatbot-input');
        const chatbotSendBtn = chatInterface.querySelector('.chatbot-send-btn');

        const message = chatbotInput.value.trim();
        if (message) {
            addMessage('user', message);
            chatbotInput.value = '';

            chatbotInput.disabled = true;
            chatbotSendBtn.disabled = true;

            const n8nWebhookUrl = 'https://n8n.systemsipe.com/webhook/97bc8e92-93b9-40ba-adb0-9b49952264a5';

            try {
                console.log('Sending message to n8n...');
                const response = await fetch(n8nWebhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: message }),
                });

                console.log('Fetch response status:', response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
                }

                const rawResponseText = await response.text();
                console.log('Raw response from n8n:', rawResponseText);

                let data;
                try {
                    data = JSON.parse(rawResponseText);
                    console.log('Parsed JSON:', data);
                } catch (jsonError) {
                    console.error('JSON parse error:', jsonError);
                    throw new Error('Invalid JSON response from bot.');
                }

                if (data && data.botResponse) {
                    const formattedMessage = formatBotResponse(data.botResponse);
                    addMessage('bot', formattedMessage, true);
                } else {
                    addMessage('bot', 'Thanks for your message. The assistant did not provide a specific answer or there was an issue processing it.');
                    console.error('Invalid or empty bot response:', data);
                }

            } catch (error) {
                addMessage('bot', 'Unable to connect to the assistant server. Please check your connection and try again later.');
                console.error('Error sending message to bot:', error);
            } finally {
                chatbotInput.disabled = false;
                chatbotSendBtn.disabled = false;
                chatbotInput.focus();
            }
        }
    };

    chatbotButton.addEventListener('click', () => {
        if (!chatInterface) {
            chatInterface = document.createElement('div');
            chatInterface.classList.add('chatbot-interface');
            chatInterface.setAttribute('aria-modal', 'true');
            chatInterface.setAttribute('role', 'dialog');

            chatInterface.innerHTML = `
                <div class="chatbot-header">
                    <h3>Smartin - Smart Global Tech Assistant</h3>
                    <button class="chatbot-close-btn" aria-label="Close chat">X</button>
                </div>
                <div class="chatbot-body"></div>
                <div class="chatbot-footer">
                    <input type="text" placeholder="Type your message..." class="chatbot-input" autocomplete="off">
                    <button class="chatbot-send-btn">Send</button>
                </div>
            `;
            document.body.appendChild(chatInterface);

            const chatbotCloseBtn = chatInterface.querySelector('.chatbot-close-btn');
            const chatbotInput = chatInterface.querySelector('.chatbot-input');
            const chatbotSendBtn = chatInterface.querySelector('.chatbot-send-btn');

            chatbotCloseBtn.addEventListener('click', () => {
                chatInterface.classList.remove('show');
                document.body.classList.remove('chatbot-open');
            });

            chatbotSendBtn.addEventListener('click', sendMessage);

            chatbotInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });

            addMessage('bot', 'Hello! 👋 I\'m Smartin, your virtual assistant here at Smart Global Tech. I\'m here to help you learn about our services, answer your questions, and guide you. You can also chat with me in Spanish or French if you prefer. How can I assist you today?', false);

            chatbotInput.disabled = false;
            chatbotSendBtn.disabled = false;
        }

        chatInterface.classList.toggle('show');
        document.body.classList.toggle('chatbot-open', chatInterface.classList.contains('show'));

        if (chatInterface.classList.contains('show')) {
            const inputField = chatInterface.querySelector('.chatbot-input');
            inputField.focus();
            const chatbotBody = chatInterface.querySelector('.chatbot-body');
            if (chatbotBody) chatbotBody.scrollTop = chatbotBody.scrollHeight;
        }
    });

    document.addEventListener('keydown', (e) => {
        if (chatInterface && e.key === 'Escape' && chatInterface.classList.contains('show')) {
            chatInterface.classList.remove('show');
            document.body.classList.remove('chatbot-open');
        }
    });

    document.addEventListener('click', (e) => {
        if (
            chatInterface &&
            chatInterface.classList.contains('show') &&
            !chatbotButton.contains(e.target) &&
            !chatInterface.contains(e.target)
        ) {
            chatInterface.classList.remove('show');
            document.body.classList.remove('chatbot-open');
        }
    });
}

