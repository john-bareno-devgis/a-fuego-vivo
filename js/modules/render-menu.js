// js/modules/render-menu.js — renderiza categorías, productos, combo, adiciones y bebidas

import { MENU, COMBO, EXTRAS, ADICIONES, BEBIDAS } from '../config.js';
import { COP, esc } from './utils.js';
import { addItem, showCartStep } from './cart.js';
import { openChorizoModal } from './chorizo-modal.js';

export function renderMenu() {
  const wrap = document.getElementById('menu-inner');
  wrap.innerHTML = MENU.map(cat => `
    <div style="margin-bottom:3rem">
      <h3 class="cat-title">${cat.emoji ?? ''} ${cat.name}</h3>
      <div class="menu-grid">
        ${cat.items.map(item => `
          <article class="menu-card2">
            <h4 class="menu-card2__name">${item.name}</h4>
            ${item.description ? `<p class="menu-card2__desc">${item.description}</p>` : ''}
            <div class="menu-card2__footer">
              <span class="menu-card2__price">${COP.format(item.price)}</span>
              <button class="menu-card2__add"
                data-name="${esc(item.name)}" data-price="${item.price}" data-emoji="${getEmoji(item.name)}" data-cat="${cat.id}"
                aria-label="Agregar ${item.name}">+ Agregar</button>
            </div>
          </article>`).join('')}
      </div>
    </div>
  `).join('') + `
    <div class="combo-note">
      <p class="combo-note__title">🔥 Arma tu combo</p>
      <p class="combo-note__desc">Adicionando <strong>${COP.format(COMBO.price)}</strong> a cualquier preparación, llévate ${COMBO.includes.toLowerCase()}.</p>
      <button class="combo-note__add" data-name="Combo (+ ${esc(COMBO.includes)})" data-price="${COMBO.price}" data-emoji="🔥" aria-label="Agregar combo">+ Agregar combo</button>
    </div>
    <div class="price-note">
      <p class="price-note__title">Incluye más sabor en cualquiera de tus preparaciones</p>
      <div class="price-note__grid">${EXTRAS.map(e => priceRow(`${e.unit} de ${e.name}`, e.price, '🍖')).join('')}</div>
    </div>
    <div class="price-note-cols">
      <div class="price-note">
        <p class="price-note__title">Adiciones</p>
        <div class="price-note__grid">${ADICIONES.map(a => priceRow(a.name, a.price, '➕')).join('')}</div>
      </div>
      <div class="price-note">
        <p class="price-note__title">Bebidas</p>
        <div class="price-note__grid">${BEBIDAS.map(b => priceRow(b.name, b.price, '🥤')).join('')}</div>
      </div>
    </div>`;

  wrap.addEventListener('click', e => {
    const btn = e.target.closest('.menu-card2__add, .price-note__add, .combo-note__add');
    if (!btn) return;
    const item = { name: btn.dataset.name, price: +btn.dataset.price, emoji: btn.dataset.emoji };
    if (btn.dataset.cat === 'choriperros') {
      openChorizoModal(item);
      return;
    }
    addItem(item);
    const label = btn.textContent;
    btn.textContent = btn.classList.contains('price-note__add') ? '✓' : '✓ Agregado';
    btn.classList.add('added');
    setTimeout(() => { btn.textContent = label; btn.classList.remove('added'); }, 1200);
    showCartStep();
  });
}

function priceRow(name, price, emoji) {
  return `<div class="price-note__row">
    <span class="price-note__row-name">${esc(name)}</span>
    <span class="price-note__row-right">
      <span class="price-note__row-price">${COP.format(price)}</span>
      <button class="price-note__add" data-name="${esc(name)}" data-price="${price}" data-emoji="${emoji}" aria-label="Agregar ${esc(name)}">+</button>
    </span>
  </div>`;
}

function getEmoji(name) {
  const n = name.toLowerCase();
  if (n.includes('hawaiano')) return '🍍';
  if (n.includes('leñador')) return '🪓';
  if (n.includes('choripán')) return '🌶️';
  if (n.includes('choriarepa')) return '🫓';
  if (n.includes('sándwich argentino')) return '🥪';
  if (n.includes('papas locas')) return '🌶️';
  return '🌭';
}
