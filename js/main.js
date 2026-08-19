// js/main.js — punto de entrada: renderiza el contenido dinámico e inicializa la UI

import { renderMenu } from './modules/render-menu.js';
import { renderSedes } from './modules/render-locations.js';
import { initChorizoModal } from './modules/chorizo-modal.js';
import { initCart } from './modules/cart.js';
import { initUI } from './modules/ui.js';

renderMenu();
renderSedes();
initChorizoModal();
initCart();
initUI();
