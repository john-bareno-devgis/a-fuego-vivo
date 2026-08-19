// js/modules/ui.js — interacciones de la barra superior (menú hamburguesa, sombra al hacer scroll)

export function initUI() {
  document.getElementById('burger')?.addEventListener('click', function () {
    const nav = document.getElementById('mobile-nav');
    const open = nav.classList.toggle('open');
    this.setAttribute('aria-expanded', open);
  });

  window.addEventListener('scroll', () => {
    document.querySelector('.hdr').style.boxShadow = window.scrollY > 20 ? '0 2px 12px rgba(0,0,0,0.1)' : '';
  }, { passive: true });
}
