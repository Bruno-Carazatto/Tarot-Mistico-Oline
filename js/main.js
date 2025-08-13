// ===== Seletores base
const header = document.getElementById('header');
const nav = document.getElementById('primaryNav');
const menuToggle = document.getElementById('menuToggle');
const backdrop = document.getElementById('backdrop');

// ===== Menu Mobile (abre/fecha, fecha ao clicar fora e ESC)
function openMenu() {
  nav.classList.add('open');
  backdrop.classList.add('show');
  menuToggle.setAttribute('aria-expanded', 'true');
}
function closeMenu() {
  nav.classList.remove('open');
  backdrop.classList.remove('show');
  menuToggle.setAttribute('aria-expanded', 'false');
}
menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.contains('open');
  isOpen ? closeMenu() : openMenu();
});
backdrop?.addEventListener('click', closeMenu);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu();
});

// ===== Header Scroll (shrink)
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});

// ===== Smooth Scrolling + fechar menu no mobile
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const offset = header.offsetHeight + 10;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });

    if (window.innerWidth <= 768) closeMenu();
  });
});

// ===== ScrollSpy (destacar link ativo)
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a');
function onScrollSpy() {
  const scrollPos = window.pageYOffset + header.offsetHeight + 20;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav a[href="#${id}"]`);
    if (scrollPos >= top && scrollPos < bottom) {
      navLinks.forEach(l => l.classList.remove('active'));
      link?.classList.add('active');
    }
  });
}
window.addEventListener('scroll', onScrollSpy);

// ===== Animação das cartas (hover)
const tarotCards = document.querySelectorAll('.tarot-card');
tarotCards.forEach((card, index) => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-20px) rotate(0deg)';
    card.style.zIndex = '10';
    card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
  });
  card.addEventListener('mouseleave', () => {
    const rotations = ['-10deg', '5deg', '15deg'];
    card.style.transform = `translateY(0) rotate(${rotations[index]})`;
    card.style.zIndex = index + 1;
    card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
  });
});

// ===== Efeito de digitação no título
const heroTitle = document.querySelector('.hero h1');
if (heroTitle) {
  const originalText = heroTitle.textContent;
  heroTitle.textContent = '';
  let i = 0;
  const typingEffect = setInterval(() => {
    if (i < originalText.length) {
      heroTitle.textContent += originalText.charAt(i);
      i++;
    } else {
      clearInterval(typingEffect);
    }
  }, 40);
}

// ===== Formulário (validação simples + WhatsApp)
const form = document.getElementById('contactForm');
const btnWhats = document.getElementById('btnWhats');

function setInvalid(el, invalid) {
  if (!el) return;
  el.setAttribute('aria-invalid', invalid ? 'true' : 'false');
}

function onlyDigits(str) {
  return (str || '').replace(/\D+/g, '');
}

// Máscara simples de WhatsApp ao digitar
const inputWhats = document.getElementById('whatsapp');
inputWhats?.addEventListener('input', () => {
  let v = onlyDigits(inputWhats.value).slice(0, 11);
  if (v.length > 6) inputWhats.value = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
  else if (v.length > 2) inputWhats.value = `(${v.slice(0,2)}) ${v.slice(2)}`;
  else inputWhats.value = v;
});

// Validar campos obrigatórios em tempo real
['nome', 'email', 'whatsapp', 'plano', 'lgpd'].forEach(id => {
  const el = document.getElementById(id);
  el?.addEventListener('input', () => setInvalid(el, !el.checkValidity()));
  el?.addEventListener('change', () => setInvalid(el, !el.checkValidity()));
});

// Submit do form (apenas frontend; pronto para backend)
form?.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome');
  const email = document.getElementById('email');
  const whatsapp = document.getElementById('whatsapp');
  const plano = document.getElementById('plano');
  const mensagem = document.getElementById('mensagem');
  const lgpd = document.getElementById('lgpd');

  const fields = [nome, email, whatsapp, plano, lgpd];
  let valid = true;
  fields.forEach(f => {
    if (!f.checkValidity()) {
      valid = false;
      setInvalid(f, true);
    }
  });
  if (!valid) return;

  // Aqui o backend poderá interceptar via fetch() / POST
  // Exemplo:
  // fetch('/api/agendar', { method:'POST', headers:{'Content-Type':'application/json'},
  //   body: JSON.stringify({ nome: nome.value, email: email.value, whatsapp: whatsapp.value, plano: plano.value, mensagem: mensagem.value }) })

  // Feedback simples no frontend
  form.reset();
  alert('Recebemos sua solicitação! Entraremos em contato para confirmar sua consulta.');
});

// Enviar pelo WhatsApp
btnWhats?.addEventListener('click', (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome')?.value?.trim();
  const email = document.getElementById('email')?.value?.trim();
  const whatsapp = document.getElementById('whatsapp')?.value?.trim();
  const plano = document.getElementById('plano')?.value;
  const mensagem = document.getElementById('mensagem')?.value?.trim() || 'Sem mensagem adicional.';

  // Valida mínimos para construir a mensagem
  if (!nome || !email || !whatsapp || !plano) {
    alert('Preencha Nome, E-mail, WhatsApp e Plano para enviar pelo WhatsApp.');
    return;
  }

  const numeroDestino = '5511987654321'; // Ajuste para o número oficial
  const texto = `Olá! Gostaria de agendar uma consulta de Tarot.%0A%0A` +
    `*Nome:* ${encodeURIComponent(nome)}%0A` +
    `*E-mail:* ${encodeURIComponent(email)}%0A` +
    `*WhatsApp:* ${encodeURIComponent(whatsapp)}%0A` +
    `*Plano:* ${encodeURIComponent(plano)}%0A` +
    `*Mensagem:* ${encodeURIComponent(mensagem)}`;

  const url = `https://wa.me/${numeroDestino}?text=${texto}`;
  window.open(url, '_blank', 'noopener');
});

// ===== Ano no rodapé
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();
