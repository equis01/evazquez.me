const modes = {
  chat: {
    number: '01',
    label: 'Modo conversación',
    name: 'Conversación',
    title: 'Piensa en voz alta con una IA que conserva el hilo.',
    description: 'Explora una decisión, aterriza una idea o resuelve dudas sin reiniciar la conversación cada vez que cambia la tarea.',
    benefits: ['Contexto continuo', 'Respuestas adaptadas', 'De la charla a la acción'],
    demo: `
      <div class="chat-line user">Tengo una idea, pero todavía está desordenada.</div>
      <div class="chat-line ai">Empecemos por el objetivo. ¿Qué debería poder lograr una persona con ella?</div>
      <div class="chat-line user">Quiero convertirla en un producto sencillo.</div>
      <div class="chat-line ai">Perfecto. Organicemos primero la propuesta y después podemos pasar a construirla. <span class="typing"><span></span><span></span><span></span></span></div>`
  },
  blog: {
    number: '02',
    label: 'Modo contenido',
    name: 'Contenido',
    title: 'Convierte una idea suelta en contenido con intención.',
    description: 'Planea, redacta y mejora blogs, guías o publicaciones manteniendo una voz consistente y un objetivo claro.',
    benefits: ['Estructura editorial', 'Voz configurable', 'Revisión en contexto'],
    demo: `
      <div class="doc-preview">
        <div class="doc-kicker"></div>
        <div class="doc-title"></div>
        <div class="doc-line"></div><div class="doc-line"></div><div class="doc-line short"></div>
        <div class="doc-line"></div><div class="doc-line"></div><div class="doc-line short"></div>
      </div>`
  },
  app: {
    number: '03',
    label: 'Modo constructor',
    name: 'Constructor de apps',
    title: 'Pasa de la explicación a una aplicación que puedes probar.',
    description: 'Define pantallas, flujos y comportamiento en lenguaje natural. LalIA transforma el plan en una experiencia funcional.',
    benefits: ['Flujos antes que adornos', 'Iteración visual', 'Código que puede evolucionar'],
    demo: `
      <div class="app-preview">
        <div class="app-side"><span></span><span></span><span></span><span></span></div>
        <div class="app-main"><div class="app-heading"></div><div class="app-cards"><div class="app-card"></div><div class="app-card"></div><div class="app-card"></div><div class="app-card"></div></div></div>
      </div>`
  },
  analysis: {
    number: '04',
    label: 'Modo análisis',
    name: 'Análisis',
    title: 'Encuentra la señal importante dentro de toda la información.',
    description: 'Resume datos, compara escenarios y convierte resultados complejos en explicaciones que ayudan a decidir.',
    benefits: ['Hallazgos accionables', 'Comparaciones claras', 'Conclusiones trazables'],
    demo: `
      <div class="chart-preview">
        <div class="bars"><span style="height:35%"></span><span style="height:62%"></span><span style="height:48%"></span><span style="height:86%"></span><span style="height:72%"></span></div>
        <div class="chart-stats"><span></span><span></span><span></span></div>
      </div>`
  }
};

const tabs = [...document.querySelectorAll('.mode-tab')];
const panel = document.getElementById('mode-panel');

function renderMode(modeKey) {
  const mode = modes[modeKey];
  document.getElementById('mode-label').textContent = mode.label;
  document.getElementById('mode-title').textContent = mode.title;
  document.getElementById('mode-description').textContent = mode.description;
  document.getElementById('demo-mode-name').textContent = mode.name;
  document.getElementById('demo-body').innerHTML = mode.demo;
  document.getElementById('mode-benefits').innerHTML = mode.benefits
    .map(item => `<li><i class="fas fa-check"></i>${item}</li>`)
    .join('');

  tabs.forEach(tab => {
    const active = tab.dataset.mode === modeKey;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active) panel.setAttribute('aria-labelledby', tab.id);
  });

}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => renderMode(tab.dataset.mode));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const offset = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (index + offset + tabs.length) % tabs.length;
    tabs[nextIndex].focus();
    renderMode(tabs[nextIndex].dataset.mode);
  });
});

const dialog = document.getElementById('demo-dialog');
document.querySelectorAll('[data-open-demo]').forEach(button => {
  button.addEventListener('click', () => dialog.showModal());
});
document.querySelectorAll('[data-close-demo]').forEach(button => {
  button.addEventListener('click', () => dialog.close());
});
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});

document.getElementById('year').textContent = new Date().getFullYear();

const sectionLinks = [...document.querySelectorAll('.floating-nav a[href^="#"]')];
const sections = sectionLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const observer = new IntersectionObserver(entries => {
  const visible = entries
    .filter(entry => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;
  sectionLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`);
  });
}, { threshold: [0.25, 0.55] });

sections.forEach(section => observer.observe(section));

renderMode('chat');

function hideLoader() {
  const loader = document.getElementById('loader-wrapper');
  loader.style.opacity = '0';
  loader.style.pointerEvents = 'none';
  setTimeout(() => {
    loader.style.visibility = 'hidden';
  }, 800);
}

if (document.readyState === 'complete') {
  hideLoader();
} else {
  window.addEventListener('load', hideLoader, { once: true });
}

const chatAnswers = {
  capabilities: {
    question: '¿Qué puede hacer?',
    answer: 'LalIA puede conversar contigo, redactar y organizar contenido, analizar información y ayudarte a convertir una idea en una aplicación. Sus capacidades pueden crecer sin obligarte a cambiar de plataforma.'
  },
  operation: {
    question: '¿Cómo funciona?',
    answer: 'Tú explicas el objetivo con tus propias palabras. LalIA identifica qué tipo de ayuda necesitas, conserva el contexto y usa la capacidad adecuada para avanzar contigo paso a paso.'
  },
  audience: {
    question: '¿Quién puede usarlo?',
    answer: 'Está pensado para personas, creadores, estudiantes, profesionales y pequeños equipos. No necesitas saber programar ni conocer comandos técnicos para empezar.'
  },
  purpose: {
    question: '¿Para qué sirve?',
    answer: 'Sirve para reducir el tiempo entre una idea y un resultado útil: aclarar decisiones, producir contenido, entender datos o crear un primer producto sin saltar entre muchas herramientas.'
  }
};

const chatLauncher = document.getElementById('chat-launcher');
const chatPanel = document.getElementById('lalia-chat');
const chatClose = document.getElementById('chat-close');
const chatMessages = document.getElementById('chat-messages');
let chatBusy = false;

function setChatOpen(open) {
  chatPanel.classList.toggle('open', open);
  chatPanel.setAttribute('aria-hidden', String(!open));
  chatLauncher.setAttribute('aria-expanded', String(open));
  if (open) chatClose.focus();
}

function addChatMessage(className, text) {
  const message = document.createElement('div');
  message.className = className;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatLauncher.addEventListener('click', () => setChatOpen(!chatPanel.classList.contains('open')));
chatClose.addEventListener('click', () => setChatOpen(false));

document.getElementById('chat-questions').addEventListener('click', event => {
  const button = event.target.closest('[data-question]');
  if (!button || chatBusy) return;

  const response = chatAnswers[button.dataset.question];
  chatBusy = true;
  addChatMessage('user-message', response.question);

  const typing = document.createElement('div');
  typing.className = 'chat-typing';
  typing.setAttribute('aria-label', 'LalIA está escribiendo');
  typing.innerHTML = '<span></span><span></span><span></span>';
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  setTimeout(() => {
    typing.remove();
    addChatMessage('guide-message', response.answer);
    chatBusy = false;
  }, 450);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && chatPanel.classList.contains('open')) setChatOpen(false);
});
