// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form submission handling with security
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Input sanitization and validation
    const name = DOMPurify.sanitize(this.querySelector('input[type="text"]').value.trim());
    const email = DOMPurify.sanitize(this.querySelector('input[type="email"]').value.trim());
    const message = DOMPurify.sanitize(this.querySelector('textarea').value.trim());
    
    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Enhanced input validation
    if (!/^[a-zA-Z0-9\s]{2,50}$/.test(name)) {
        alert('Name contains invalid characters or length');
        return;
    }
    
    if (message.length < 10 || message.length > 1000) {
        alert('Message must be between 10 and 1000 characters');
        return;
    }
    
    // IP-based rate limiting
    const clientIP = getCurrentIP(); // Implement this function on server-side
    const rateLimit = getRateLimit(clientIP); // Implement this function on server-side
    
    if (!rateLimit.allowed) {
        alert(`Please wait ${rateLimit.timeRemaining} seconds before sending another message`);
        return;
    }

    // Add CSRF token
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
    // Secure form submission
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
            name,
            email,
            message,
            timestamp: Date.now()
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        } else {
            alert('An error occurred. Please try again later.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    });
});

// Add active class to nav items on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Terminal typing effect
const commands = [
    'whoami',
    'Hari Haran - Full Stack Developer',
    'skills --list',
    'JavaScript, React, Node.js, Python, MongoDB',
    'experience --years',
    '2+ years of development experience',
    'projects --count',
    '15+ projects completed successfully',
    'contact --info',
    'Email: hariharan@example.com'
];

function typeWriter(text, element, speed = 50) {
    let i = 0;
    return new Promise(resolve => {
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                setTimeout(resolve, 1000);
            }
        }
        type();
    });
}

async function runTerminal() {
    const terminalText = document.querySelector('.typed-text');
    
    while (true) {
        for (let i = 0; i < commands.length; i += 2) {
            terminalText.textContent = '';
            await typeWriter(commands[i], terminalText);
            terminalText.textContent = '';
            await typeWriter(commands[i + 1], terminalText, 30);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

// Start terminal animation when the section is visible
const terminalSection = document.querySelector('.terminal-section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            runTerminal();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

observer.observe(terminalSection);


// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Close mobile menu when scrolling
window.addEventListener('scroll', () => {
    if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
    }
});

// AI Chat Assistant
const chatButton = document.getElementById('chatButton');
const chatContainer = document.getElementById('chatContainer');
const closeChat = document.getElementById('closeChat');
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendMessage = document.getElementById('sendMessage');

// Toggle chat window
chatButton.addEventListener('click', () => {
    chatContainer.style.display = chatContainer.style.display === 'flex' ? 'none' : 'flex';
});

closeChat.addEventListener('click', () => {
    chatContainer.style.display = 'none';
});

// Send message function
function sendUserMessage() {
    const message = userInput.value.trim();
    if (message) {
        // Add user message
        addMessage(message, 'user');
        // Get AI response
        getAIResponse(message);
        // Clear input
        userInput.value = '';
    }
}

// Handle send button click and Enter key
sendMessage.addEventListener('click', sendUserMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendUserMessage();
    }
});

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Simple AI response function (you can enhance this with more sophisticated logic)
function getAIResponse(userMessage) {
    const responses = {
        'skills': "Hari is skilled in HTML5, CSS3, JavaScript, React, Node.js, Python, MongoDB, and more!",
        'contact': "You can contact Hari through the contact form or via email at hariharan@example.com",
        'projects': "Hari has worked on various projects including an E-commerce Platform, Task Management System, and AI Chat Application.",
        'experience': "Hari has 2+ years of development experience and has completed 15+ projects successfully.",
        'education': "Hari has a B.Tech in Computer Science.",
        'default': "I'm here to help! You can ask me about Hari's skills, projects, experience, or how to contact him."
    };

    setTimeout(() => {
        const lowercaseMessage = userMessage.toLowerCase();
        let response = responses.default;

        Object.keys(responses).forEach(key => {
            if (lowercaseMessage.includes(key)) {
                response = responses[key];
            }
        });

        addMessage(response, 'bot');
    }, 500);
}