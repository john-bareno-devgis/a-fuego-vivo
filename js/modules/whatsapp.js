// js/modules/whatsapp.js — arma y envía el mensaje de pedido por WhatsApp

import { LOCATIONS } from '../config.js';
import { COP } from './utils.js';

const phone = LOCATIONS[0]?.phone ?? '573219357262';

/**
 * Construye el mensaje del pedido y abre WhatsApp con el texto prellenado.
 */
export function sendOrderToWhatsApp({ cart, deliveryFee, total, name, addr, apto, pay }) {
  const lines = cart.map(i => `- ${i.name} x${i.qty} (${COP.format(i.price * i.qty)})`);
  const msg = [
    `*Pedido A Fuego Vivo Hot Dog*`, '',
    ...lines, '',
    `Domicilio: ${COP.format(deliveryFee)}`,
    `*Total: ${COP.format(total)}*`, '',
    `*Nombre:* ${name}`,
    `*Direccion:* ${addr}`,
    ...(apto ? [`*Apartamento:* ${apto}`] : []),
    `*Pago:* ${pay}`, '',
    'Gracias!',
  ].join('\n');
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
}
