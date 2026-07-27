// js/modules/ui.js

/**
 * Inyecta los tokens de marca como CSS custom properties en :root
 */
export function injectBrandTokens(brand) {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', brand.primary);
  root.style.setProperty('--color-primary-dark', brand.primaryDark);
  root.style.setProperty('--color-accent', brand.accent);
  root.style.setProperty('--color-surface', brand.surface);
  root.style.setProperty('--color-surface-light', brand.surfaceLight);
  root.style.setProperty('--color-surface-card', brand.surfaceCard);
  root.style.setProperty('--color-text', brand.text);
  root.style.setProperty('--color-text-muted', brand.textMuted);
  root.style.setProperty('--font-display', `'${brand.fontDisplay}', sans-serif`);
  root.style.setProperty('--font-body', `'${brand.fontBody}', sans-serif`);
}

/**
 * Inicializa todas las interacciones de UI:
 * - Header scroll shrink
 * - Hamburger menu toggle
 * - Intersection Observer para animaciones de entrada
 * - Smooth scroll para anclas internas
 */
export function initUI() {
  initHeaderScroll();
  initHamburger();
  initScrollAnimations();
  initSmoothScroll();
}

function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initHamburger() {
  const btn = document.querySelector('.header__hamburger');
  const menu = document.querySelector('.header__mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
    menu.classList.toggle('header__mobile-menu--open', !isOpen);
  });

  // Cerrar al hacer clic en un link del menú móvil
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.setAttribute('aria-expanded', 'false');
      menu.classList.remove('header__mobile-menu--open');
    });
  });

  // Cerrar al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      btn.setAttribute('aria-expanded', 'false');
      menu.classList.remove('header__mobile-menu--open');
    }
  });
}

function initScrollAnimations() {
  const elements = document.querySelectorAll('.menu-card, .location-card, .fade-in');
  if (!elements.length) return;

  // Verificar soporte de IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => {
      el.classList.add('menu-card--visible', 'location-card--visible', 'fade-in--visible');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Escalonar la animación de elementos en grid
        setTimeout(() => {
          entry.target.classList.add('menu-card--visible', 'location-card--visible', 'fade-in--visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  elements.forEach(el => observer.observe(el));
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const headerHeight = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--header-height')) || 64;

      window.scrollTo({
        top: target.offsetTop - headerHeight,
        behavior: 'smooth',
      });
    });
  });
}
