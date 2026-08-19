// js/modules/cart.js — estado del carrito, panel lateral y formulario de datos

import { PAYMENT, DELIVERY_FEE } from '../config.js';
import { COP, esc } from './utils.js';
import { sendOrderToWhatsApp } from './whatsapp.js';

let cart = [];

export function addItem({ name, price, emoji }) {
  const ex = cart.find(i => i.name === name);
  ex ? ex.qty++ : cart.push({ name, price, emoji, qty: 1 });
  updateBadges();
}

export function changeQty(name, d) {
  const i = cart.find(i => i.name === name);
  if (!i) return;
  i.qty += d;
  if (i.qty <= 0) cart = cart.filter(x => x.name !== name);
  updateBadges();
}

function subtotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }
function total() { return cart.length ? subtotal() + DELIVERY_FEE : 0; }
function totalItems() { return cart.reduce((s, i) => s + i.qty, 0); }

function updateBadges() {
  const n = totalItems();
  ['cart-badge', 'cart-badge-mobile'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = n;
    n > 0 ? el.removeAttribute('hidden') : el.setAttribute('hidden', '');
  });
  const fab = document.getElementById('cart-fab');
  const fc = document.getElementById('cart-fab-count');
  if (fab) n > 0 ? fab.removeAttribute('hidden') : fab.setAttribute('hidden', '');
  if (fc) fc.textContent = n;
}

export function showCartStep() {
  document.getElementById('cp-title').textContent = '🛒 Tu Pedido';
  const body = document.getElementById('cart-body');
  const footer = document.getElementById('cart-footer');
  if (cart.length === 0) {
    body.innerHTML = `<div class="cart-empty2"><span class="cart-empty2__icon">🌭</span><p class="cart-empty2__txt">Tu pedido está vacío.<br>¡Agrega algo del menú!</p><button class="cart-empty2__btn" id="go-menu">Ver el menú</button></div>`;
    footer.innerHTML = '';
    document.getElementById('go-menu')?.addEventListener('click', () => { closeCart(); document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' }); });
    return;
  }
  body.innerHTML = cart.map(i => `
    <div class="ci">
      <span class="ci__emoji">${i.emoji}</span>
      <div class="ci__info"><p class="ci__name">${esc(i.name)}</p><p class="ci__price">${COP.format(i.price * i.qty)}</p></div>
      <div class="ci__ctrl">
        <button class="ci__btn" data-action="dec" data-name="${esc(i.name)}">−</button>
        <span class="ci__qty">${i.qty}</span>
        <button class="ci__btn" data-action="inc" data-name="${esc(i.name)}">+</button>
      </div>
    </div>`).join('');
  footer.innerHTML = `
    <div class="ct-total">
      <span class="ct-total__lbl">Total</span>
      <span class="ct-total__vals">
        <span class="ct-total__delivery">+ ${COP.format(DELIVERY_FEE)} domicilio</span>
        <span class="ct-total__val">${COP.format(total())}</span>
      </span>
    </div>
    <button class="ct-next" id="go-form">Finalizar pedido →</button>
    <button class="ct-clear" id="ct-clear">Vaciar pedido</button>`;
  body.onclick = e => {
    const b = e.target.closest('.ci__btn'); if (!b) return;
    changeQty(b.dataset.name, b.dataset.action === 'inc' ? 1 : -1); showCartStep();
  };
  document.getElementById('go-form')?.addEventListener('click', showFormStep);
  document.getElementById('ct-clear')?.addEventListener('click', () => { cart = []; updateBadges(); showCartStep(); });
}

function showFormStep() {
  document.getElementById('cp-title').textContent = 'Datos del pedido';
  const body = document.getElementById('cart-body');
  const footer = document.getElementById('cart-footer');
  const resumen = cart.map(i => `<span class="of-summary__item">${i.emoji} ${i.name} ×${i.qty}</span>`).join('');
  body.innerHTML = `
    <div class="of-summary">
      <p class="of-summary__lbl">Tu pedido</p>
      <div class="of-summary__items">${resumen}</div>
      <p class="of-summary__delivery">+ ${COP.format(DELIVERY_FEE)} domicilio</p>
      <p class="of-summary__total">${COP.format(total())}</p>
    </div>
    <form class="of" id="order-form" novalidate>
      <div class="of__field">
        <label class="of__label" for="f-name">Nombre completo</label>
        <input class="of__input" type="text" id="f-name" placeholder="Tu nombre" autocomplete="name" required>
        <p class="of__err" id="e-name" hidden>Por favor ingresa tu nombre.</p>
      </div>
      <div class="of__field">
        <label class="of__label" for="f-addr">Direccion de entrega</label>
        <input class="of__input" type="text" id="f-addr" placeholder="Calle, carrera, barrio..." autocomplete="street-address" required>
        <p class="of__err" id="e-addr" hidden>Por favor ingresa tu direccion.</p>
      </div>
      <div class="of__field">
        <label class="of__label" for="f-apto">Apartamento</label>
        <input class="of__input" type="text" id="f-apto" placeholder="Torre, apto, interior... (opcional)" autocomplete="address-line2">
      </div>
      <div class="of__field">
        <p class="of__label">Metodo de pago</p>
        <div class="pay-opts" role="radiogroup">
          <label class="pay-opt"><input type="radio" name="pay" value="Llave" required><span class="pay-opt__card"><span class="pay-opt__icon">🔑</span><span class="pay-opt__name">Llave</span></span></label>
          <label class="pay-opt"><input type="radio" name="pay" value="Efectivo"><span class="pay-opt__card"><span class="pay-opt__icon">💵</span><span class="pay-opt__name">Efectivo</span></span></label>
        </div>
        <p class="of__err" id="e-pay" hidden>Elige un metodo de pago.</p>
        <div class="llave-info" id="llave-info" hidden>
          <img class="llave-info__qr" src="${PAYMENT.qrImage}" alt="Código QR para pagar por Bre-B">
          <p class="llave-info__label">Escanea este QR o paga por Bre-B a la llave:</p>
          <p class="llave-info__key">${esc(PAYMENT.llaveKey)}</p>
          <p class="llave-info__name">A nombre de ${esc(PAYMENT.llaveName)}</p>
          <p class="llave-info__note">Comparte el comprobante por WhatsApp luego de enviar el pedido.</p>
        </div>
      </div>
    </form>`;
  footer.innerHTML = `
    <button class="ct-back" id="back-cart">← Volver al pedido</button>
    <button class="ct-wa" id="send-wa">
      <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      Enviar por WhatsApp
    </button>`;
  body.querySelectorAll('.pay-opt input').forEach(r => r.addEventListener('change', () => {
    body.querySelectorAll('.pay-opt__card').forEach(c => c.classList.remove('sel'));
    r.nextElementSibling.classList.add('sel');
    const llaveInfo = document.getElementById('llave-info');
    llaveInfo?.toggleAttribute('hidden', r.value !== 'Llave');
    if (r.value === 'Llave') llaveInfo?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }));
  document.getElementById('back-cart')?.addEventListener('click', showCartStep);
  document.getElementById('send-wa')?.addEventListener('click', submitForm);
}

function submitForm() {
  const name = document.getElementById('f-name')?.value.trim();
  const addr = document.getElementById('f-addr')?.value.trim();
  const apto = document.getElementById('f-apto')?.value.trim();
  const pay = document.querySelector('input[name="pay"]:checked')?.value ?? '';
  const se = (id, show) => { const el = document.getElementById(id); if (el) el.hidden = !show; const inp = document.getElementById(id.replace('e-', 'f-')); inp?.classList.toggle('err', show); };
  se('e-name', !name); se('e-addr', !addr); se('e-pay', !pay);
  if (!name || !addr || !pay) return;
  sendOrderToWhatsApp({ cart, deliveryFee: DELIVERY_FEE, total: total(), name, addr, apto, pay });
}

export function openCart() { const p = document.getElementById('cart-panel'), o = document.getElementById('cart-overlay'); p?.classList.add('open'); p?.setAttribute('aria-hidden', 'false'); o?.classList.add('open'); document.body.style.overflow = 'hidden'; }
export function closeCart() { const p = document.getElementById('cart-panel'), o = document.getElementById('cart-overlay'); p?.classList.remove('open'); p?.setAttribute('aria-hidden', 'true'); o?.classList.remove('open'); document.body.style.overflow = ''; }

export function initCart() {
  ['cart-toggle', 'cart-toggle-mobile', 'cart-fab', 'menu-finish-btn'].forEach(id =>
    document.getElementById(id)?.addEventListener('click', () => { showCartStep(); openCart(); })
  );
  document.getElementById('cart-close')?.addEventListener('click', closeCart);
  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
  showCartStep();
}
