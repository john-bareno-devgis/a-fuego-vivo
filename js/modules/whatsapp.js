// js/modules/whatsapp.js

/**
 * Construye el enlace de WhatsApp con mensaje prellenado
 */
export function buildWhatsAppLink(location, customMessage = '') {
  const message = customMessage
    || `¡Hola! Quiero hacer un pedido en ${location.name} 🌭🔥`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${location.phone}?text=${encoded}`;
}

/**
 * Inicializa el botón flotante de WhatsApp
 * Usa la primera sede disponible o permite selección si hay varias
 */
export function initWhatsApp(locations) {
  const fab = document.querySelector('.whatsapp-fab');
  if (!fab || !locations.length) return;

  // Con una sola sede, el FAB apunta directamente a ella
  const primary = locations[0];
  fab.setAttribute('href', buildWhatsAppLink(primary));
  fab.setAttribute('aria-label', `Pedir por WhatsApp — ${primary.name}`);

  // Los botones de sede ya tienen sus href desde render-locations
}
