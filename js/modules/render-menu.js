// js/modules/render-menu.js

const COP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

/**
 * Genera el HTML de categorías y productos del menú.
 * Cada tarjeta incluye un botón "Agregar al carrito" que dispara
 * el evento personalizado 'cart:add' con los datos del producto.
 */
export function renderMenu(menuData, chorizos = []) {
  const section = document.querySelector('#menu .menu-section__inner');
  if (!section) return;

  const html = menuData.map(category => `
    <div class="menu-category">
      <div class="menu-category__header">
        ${category.emoji ? `<span class="menu-category__emoji" aria-hidden="true">${category.emoji}</span>` : ''}
        <h3 class="menu-category__name">${category.name}</h3>
      </div>
      <div class="menu-category__grid">
        ${category.items.map(item => renderCard(item)).join('')}
      </div>
    </div>
  `).join('');

  const chorizosNote = chorizos.length ? `
    <div class="menu-note">
      <p class="menu-note__title">🌶️ Chorizos disponibles</p>
      <div class="menu-note__list">
        ${chorizos.map(c => `<span class="menu-note__tag">${c}</span>`).join('')}
      </div>
    </div>
  ` : '';

  section.innerHTML = html + chorizosNote;

  // Delegación de eventos para los botones "Agregar"
  section.addEventListener('click', (e) => {
    const btn = e.target.closest('.menu-card__add');
    if (!btn) return;

    const name = btn.dataset.name;
    const price = Number(btn.dataset.price);
    const emoji = btn.dataset.emoji;

    // Emitir evento hacia el módulo del carrito
    document.dispatchEvent(new CustomEvent('cart:add', {
      detail: { name, price, emoji },
    }));

    // Feedback visual breve
    btn.textContent = '✓ Agregado';
    btn.classList.add('menu-card__add--added');
    setTimeout(() => {
      btn.textContent = '+ Agregar al pedido';
      btn.classList.remove('menu-card__add--added');
    }, 1200);
  });
}

function renderCard(item) {
  const emoji = getEmoji(item.name);
  return `
    <article class="menu-card">
      <h4 class="menu-card__name">${item.name}</h4>
      ${item.description ? `<p class="menu-card__description">${item.description}</p>` : ''}
      <div class="menu-card__footer">
        <span class="menu-card__price">${COP.format(item.price)}</span>
        <span class="menu-card__fire" aria-hidden="true">🔥</span>
      </div>
      <button
        class="menu-card__add"
        data-name="${item.name}"
        data-price="${item.price}"
        data-emoji="${emoji}"
        aria-label="Agregar ${item.name} al pedido"
      >+ Agregar al pedido</button>
    </article>
  `;
}

function getEmoji(name) {
  if (name.toLowerCase().includes('hawaiano')) return '🍍';
  if (name.toLowerCase().includes('leñador')) return '🪓';
  if (name.toLowerCase().includes('choripán')) return '🌶️';
  return '🌭';
}
