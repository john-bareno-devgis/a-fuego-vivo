// js/modules/cart.js
// Gestiona estado, UI y envío del pedido por WhatsApp
// Flujo: carrito → formulario de confirmación → WhatsApp

const COP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

// Estado
let cartItems = [];
let currentPhone = '573219357262';

// ──────────────────────────────────────────────
// API pública
// ──────────────────────────────────────────────

export function initCart(locations) {
  currentPhone = locations?.[0]?.phone ?? '573219357262';

  document.addEventListener('cart:add', (e) => {
    addItem(e.detail);
    showCartStep();
    openCart();
  });

  ['cart-toggle', 'cart-toggle-mobile', 'cart-fab'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => {
      showCartStep();
      openCart();
    });
  });

  document.getElementById('cart-close')?.addEventListener('click', closeCart);
  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);

  showCartStep();
}

// ──────────────────────────────────────────────
// Lógica del carrito
// ──────────────────────────────────────────────

function addItem({ name, price, emoji }) {
  const existing = cartItems.find(i => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cartItems.push({ name, price, emoji, qty: 1 });
  }
  updateBadges();
}

function changeQty(name, delta) {
  const item = cartItems.find(i => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cartItems = cartItems.filter(i => i.name !== name);
  updateBadges();
}

function clearCart() {
  cartItems = [];
  updateBadges();
}

function getTotal() {
  return cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function getTotalItems() {
  return cartItems.reduce((sum, i) => sum + i.qty, 0);
}

// ──────────────────────────────────────────────
// PASO 1 — Lista del carrito
// ──────────────────────────────────────────────

function showCartStep() {
  const body   = document.getElementById('cart-body');
  const footer = document.getElementById('cart-footer');
  if (!body || !footer) return;

  updatePanelTitle('🛒 Tu Pedido');

  if (cartItems.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <span class="cart-empty__icon">🌭</span>
        <p class="cart-empty__text">Tu pedido está vacío.<br>¡Agrega algo del menú para comenzar!</p>
        <button class="cart-empty__cta" id="go-to-menu">Ver el menú</button>
      </div>`;
    footer.innerHTML = '';
    document.getElementById('go-to-menu')?.addEventListener('click', () => {
      closeCart();
      document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' });
    });
    return;
  }

  body.innerHTML = cartItems.map(item => `
    <div class="cart-item">
      <span class="cart-item__emoji" aria-hidden="true">${item.emoji}</span>
      <div class="cart-item__info">
        <p class="cart-item__name">${escHtml(item.name)}</p>
        <p class="cart-item__price">${COP.format(item.price * item.qty)}</p>
      </div>
      <div class="cart-item__controls">
        <button class="cart-item__qty-btn" data-action="dec" data-name="${escHtml(item.name)}" aria-label="Quitar uno">−</button>
        <span class="cart-item__qty">${item.qty}</span>
        <button class="cart-item__qty-btn" data-action="inc" data-name="${escHtml(item.name)}" aria-label="Agregar uno">+</button>
      </div>
    </div>
  `).join('');

  footer.innerHTML = `
    <div class="cart-total">
      <span class="cart-total__label">Total</span>
      <span class="cart-total__value">${COP.format(getTotal())}</span>
    </div>
    <button class="cart-confirm-btn" id="go-to-form">
      Continuar con el pedido →
    </button>
    <button class="cart-clear-btn" id="cart-clear">Vaciar pedido</button>`;

  body.addEventListener('click', handleQtyClick);
  document.getElementById('go-to-form')?.addEventListener('click', showFormStep);
  document.getElementById('cart-clear')?.addEventListener('click', () => {
    clearCart();
    showCartStep();
  });
}

function handleQtyClick(e) {
  const btn = e.target.closest('.cart-item__qty-btn');
  if (!btn) return;
  changeQty(btn.dataset.name, btn.dataset.action === 'inc' ? 1 : -1);
  showCartStep();
}

// ──────────────────────────────────────────────
// PASO 2 — Formulario de confirmación
// ──────────────────────────────────────────────

function showFormStep() {
  const body   = document.getElementById('cart-body');
  const footer = document.getElementById('cart-footer');
  if (!body || !footer) return;

  updatePanelTitle('📋 Datos del pedido');

  // Resumen compacto del pedido
  const resumen = cartItems.map(i =>
    `<span class="order-summary__item">${i.emoji} ${i.name} ×${i.qty}</span>`
  ).join('');

  body.innerHTML = `
    <div class="order-summary">
      <p class="order-summary__label">Tu pedido</p>
      <div class="order-summary__items">${resumen}</div>
      <p class="order-summary__total">${COP.format(getTotal())}</p>
    </div>

    <form class="order-form" id="order-form" novalidate>

      <div class="order-form__field">
        <label class="order-form__label" for="field-name">
          👤 Nombre completo
        </label>
        <input
          class="order-form__input"
          type="text"
          id="field-name"
          name="name"
          placeholder="¿Cómo te llamas?"
          autocomplete="name"
          required
        >
        <p class="order-form__error" id="error-name" hidden>Por favor ingresa tu nombre.</p>
      </div>

      <div class="order-form__field">
        <label class="order-form__label" for="field-address">
          📍 Dirección de entrega
        </label>
        <input
          class="order-form__input"
          type="text"
          id="field-address"
          name="address"
          placeholder="Calle, carrera, barrio..."
          autocomplete="street-address"
          required
        >
        <p class="order-form__error" id="error-address" hidden>Por favor ingresa tu dirección.</p>
      </div>

      <div class="order-form__field">
        <p class="order-form__label">💳 Método de pago</p>
        <div class="payment-options" role="radiogroup" aria-label="Método de pago">
          <label class="payment-option">
            <input type="radio" name="payment" value="Nequi" required>
            <span class="payment-option__card">
              <span class="payment-option__icon">📱</span>
              <span class="payment-option__name">Nequi</span>
            </span>
          </label>
          <label class="payment-option">
            <input type="radio" name="payment" value="Llave">
            <span class="payment-option__card">
              <span class="payment-option__icon">🔑</span>
              <span class="payment-option__name">Llave</span>
            </span>
          </label>
          <label class="payment-option">
            <input type="radio" name="payment" value="Efectivo">
            <span class="payment-option__card">
              <span class="payment-option__icon">💵</span>
              <span class="payment-option__name">Efectivo</span>
            </span>
          </label>
        </div>
        <p class="order-form__error" id="error-payment" hidden>Elige un método de pago.</p>
      </div>

    </form>`;

  footer.innerHTML = `
    <a class="cart-back-btn" id="back-to-cart">← Volver al pedido</a>
    <button class="cart-confirm-btn" id="send-whatsapp">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="#fff" width="22" height="22">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      Enviar pedido por WhatsApp
    </button>`;

  // Resaltar opción de pago seleccionada
  body.querySelectorAll('.payment-option input[type=radio]').forEach(radio => {
    radio.addEventListener('change', () => {
      body.querySelectorAll('.payment-option__card').forEach(c => c.classList.remove('payment-option__card--selected'));
      radio.nextElementSibling?.classList.add('payment-option__card--selected');
    });
  });

  document.getElementById('back-to-cart')?.addEventListener('click', showCartStep);
  document.getElementById('send-whatsapp')?.addEventListener('click', handleFormSubmit);
}

function handleFormSubmit() {
  const form    = document.getElementById('order-form');
  const name    = form.querySelector('#field-name').value.trim();
  const address = form.querySelector('#field-address').value.trim();
  const payment = form.querySelector('input[name="payment"]:checked')?.value ?? '';

  let valid = true;

  // Validación
  const showError = (id, show) => {
    const el = document.getElementById(id);
    if (el) el.hidden = !show;
    const input = form.querySelector(`#field-${id.replace('error-', '')}`);
    input?.classList.toggle('order-form__input--error', show);
  };

  showError('error-name',    !name);
  showError('error-address', !address);
  showError('error-payment', !payment);

  if (!name)    valid = false;
  if (!address) valid = false;
  if (!payment) valid = false;

  if (!valid) return;

  // Construir y abrir WhatsApp
  const link = buildWhatsAppLink(currentPhone, { name, address, payment });
  window.open(link, '_blank', 'noopener,noreferrer');
}

// ──────────────────────────────────────────────
// WhatsApp message builder
// ──────────────────────────────────────────────

function buildWhatsAppLink(phone, customer = {}) {
  const lines = cartItems.map(i =>
    `• ${i.name} x${i.qty} — ${COP.format(i.price * i.qty)}`
  );

  const customerLines = customer.name ? [
    '',
    `*Nombre:* ${customer.name}`,
    `*Direccion:* ${customer.address}`,
    `*Pago:* ${customer.payment}`,
  ] : [];

  const message = [
    '*Pedido A Fuego Vivo Hot Dog*',
    '',
    ...lines,
    '',
    `*Total: ${COP.format(getTotal())}*`,
    ...customerLines,
    '',
    'Gracias!',
  ].join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

// ──────────────────────────────────────────────
// Panel helpers
// ──────────────────────────────────────────────

function updatePanelTitle(title) {
  const el = document.querySelector('.cart-panel__title');
  if (el) el.textContent = title;
}

function openCart() {
  const panel   = document.getElementById('cart-panel');
  const overlay = document.getElementById('cart-overlay');
  panel?.classList.add('cart-panel--open');
  panel?.setAttribute('aria-hidden', 'false');
  overlay?.classList.add('cart-overlay--visible');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const panel   = document.getElementById('cart-panel');
  const overlay = document.getElementById('cart-overlay');
  panel?.classList.remove('cart-panel--open');
  panel?.setAttribute('aria-hidden', 'true');
  overlay?.classList.remove('cart-overlay--visible');
  document.body.style.overflow = '';
}

// ──────────────────────────────────────────────
// Badges y FAB
// ──────────────────────────────────────────────

function updateBadges() {
  const count = getTotalItems();

  ['cart-badge', 'cart-badge-mobile'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = count;
    count > 0 ? el.removeAttribute('hidden') : el.setAttribute('hidden', '');
  });

  const fab      = document.getElementById('cart-fab');
  const fabCount = document.getElementById('cart-fab-count');
  if (fab) count > 0 ? fab.removeAttribute('hidden') : fab.setAttribute('hidden', '');
  if (fabCount) fabCount.textContent = count;
}

// ──────────────────────────────────────────────
// Utilidades
// ──────────────────────────────────────────────

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
