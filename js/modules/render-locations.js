// js/modules/render-locations.js
import { buildWhatsAppLink } from './whatsapp.js';

/**
 * Genera tarjetas de sedes e inyecta en <section id="sedes">
 */
export function renderLocations(locations) {
  const grid = document.querySelector('#sedes .locations__grid');
  if (!grid || !locations.length) return;

  grid.innerHTML = locations.map(loc => renderCard(loc)).join('');
}

function renderCard(loc) {
  const waLink = buildWhatsAppLink(loc);
  const phoneDisplay = loc.phone.replace('57', '+57 ').replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');

  return `
    <article class="location-card">
      <div class="location-card__icon" aria-hidden="true">📍</div>
      <h3 class="location-card__name">${loc.name}</h3>

      <div class="location-card__details">
        <div class="location-card__detail">
          <span class="location-card__detail-icon" aria-hidden="true">🏠</span>
          <div class="location-card__detail-text">
            <strong>Dirección</strong>
            ${loc.address}${loc.city ? `, ${loc.city}` : ''}
          </div>
        </div>

        <div class="location-card__detail">
          <span class="location-card__detail-icon" aria-hidden="true">🕐</span>
          <div class="location-card__detail-text">
            <strong>Horario</strong>
            ${loc.schedule}
          </div>
        </div>

        <div class="location-card__detail">
          <span class="location-card__detail-icon" aria-hidden="true">📱</span>
          <div class="location-card__detail-text">
            <strong>Teléfono</strong>
            ${phoneDisplay}
          </div>
        </div>
      </div>

      <div class="location-card__actions">
        <a
          href="${waLink}"
          target="_blank"
          rel="noopener noreferrer"
          class="location-card__whatsapp"
          aria-label="Pedir por WhatsApp en ${loc.name}"
        >
          <svg class="location-card__whatsapp-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Pedir por WhatsApp
        </a>

        ${loc.mapsUrl ? `
        <a
          href="${loc.mapsUrl}"
          target="_blank"
          rel="noopener noreferrer"
          class="location-card__maps"
          aria-label="Ver ${loc.name} en Google Maps"
        >
          📍 Ver en Google Maps
        </a>` : ''}
      </div>
    </article>
  `;
}
