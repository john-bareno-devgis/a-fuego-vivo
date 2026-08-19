// js/modules/render-locations.js — renderiza las tarjetas de sede con su mapa embebido

import { LOCATIONS } from '../config.js';
import { esc } from './utils.js';
import { showCartStep, openCart } from './cart.js';

export function renderSedes() {
  document.getElementById('sede-grid').innerHTML = LOCATIONS.map(loc => `
    <div class="sede-card">
      <div class="sede-info">
        <h3 class="sede-card__name">${loc.name}</h3>
        <div class="sede-detail"><span class="sede-detail__icon">🏠</span><div class="sede-detail__text"><strong>Dirección</strong>${loc.address}${loc.city ? ', ' + loc.city : ''}</div></div>
        <div class="sede-detail"><span class="sede-detail__icon">🕐</span><div class="sede-detail__text"><strong>Horario</strong>${loc.schedule}</div></div>
        <div class="sede-detail"><span class="sede-detail__icon">📱</span><div class="sede-detail__text"><strong>Teléfono</strong>+57 ${loc.phone.replace('57', '')}</div></div>
      </div>
      <button type="button" class="sede-wa" data-open-cart>Haz tu pedido</button>
      <div class="sede-map-wrap">
        <iframe class="sede-map" src="${mapsEmbedSrc(loc)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Mapa de ${esc(loc.name)}"></iframe>
      </div>
    </div>`).join('');

  document.getElementById('sede-grid')?.addEventListener('click', e => {
    if (!e.target.closest('[data-open-cart]')) return;
    showCartStep(); openCart();
  });
}

function mapsEmbedSrc(loc) {
  const q = encodeURIComponent(loc.mapsQuery || `${loc.address}${loc.city ? ', ' + loc.city : ''}`);
  return `https://www.google.com/maps?q=${q}&z=17&output=embed`;
}
