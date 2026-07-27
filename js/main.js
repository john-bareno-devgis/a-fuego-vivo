// js/main.js — Punto de entrada principal
import { BRAND, MENU, CHORIZOS, LOCATIONS } from './config.js';
import { injectBrandTokens, initUI } from './modules/ui.js';
import { renderMenu } from './modules/render-menu.js';
import { renderLocations } from './modules/render-locations.js';
import { initWhatsApp } from './modules/whatsapp.js';
import { initCart } from './modules/cart.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inyectar tokens de marca como variables CSS
  injectBrandTokens(BRAND);

  // 2. Renderizar contenido dinámico
  renderMenu(MENU, CHORIZOS);
  renderLocations(LOCATIONS);

  // 3. Inicializar carrito (antes que WhatsApp FAB para no conflicto de z-index)
  initCart(LOCATIONS);

  // 4. Inicializar WhatsApp FAB
  initWhatsApp(LOCATIONS);

  // 5. Inicializar UI: header scroll, hamburger, animaciones
  initUI();
});
