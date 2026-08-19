// js/modules/chorizo-modal.js — diálogo para elegir el chorizo al agregar un choriperro

import { CHORIZOS } from '../config.js';
import { esc } from './utils.js';
import { addItem, showCartStep } from './cart.js';

let pendingItem = null;

export function openChorizoModal(item) {
  pendingItem = item;
  document.getElementById('chorizo-modal-sub').textContent = `Para tu ${item.name}, ¿qué chorizo prefieres?`;
  document.getElementById('chorizo-opts').innerHTML = CHORIZOS.map(c =>
    `<button type="button" class="chorizo-opt" data-chorizo="${esc(c)}">${esc(c)}</button>`
  ).join('');
  document.getElementById('chorizo-modal')?.classList.add('open');
  document.getElementById('chorizo-modal')?.setAttribute('aria-hidden', 'false');
  document.getElementById('chorizo-overlay')?.classList.add('open');
}

function closeChorizoModal() {
  pendingItem = null;
  document.getElementById('chorizo-modal')?.classList.remove('open');
  document.getElementById('chorizo-modal')?.setAttribute('aria-hidden', 'true');
  document.getElementById('chorizo-overlay')?.classList.remove('open');
}

export function initChorizoModal() {
  document.getElementById('chorizo-opts')?.addEventListener('click', e => {
    const btn = e.target.closest('.chorizo-opt');
    if (!btn || !pendingItem) return;
    const item = pendingItem;
    addItem({ name: `${item.name} (${btn.dataset.chorizo})`, price: item.price, emoji: item.emoji });
    closeChorizoModal();
    showCartStep();
  });
  document.getElementById('chorizo-close')?.addEventListener('click', closeChorizoModal);
  document.getElementById('chorizo-overlay')?.addEventListener('click', closeChorizoModal);
}
