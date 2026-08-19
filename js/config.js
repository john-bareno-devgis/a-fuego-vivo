// js/config.js
// ─────────────────────────────────────────────────────────────
// CONFIGURACIÓN DEL SITIO — editar solo este archivo para
// actualizar textos, productos, sedes y redes sociales.
// ─────────────────────────────────────────────────────────────

export const SITE = {
  name: 'A Fuego Vivo Hot Dog',
  tagline: 'Sabor que enciende tus sentidos',
  description: 'Hot dogs artesanales a la parrilla en Bogotá. Pan artesanal, ingredientes frescos y el mejor sabor. ¡Pídenos por WhatsApp!',
  domain: 'https://afuego-vivo.com',
  ogImage: '/assets/images/og-image.jpg',
  menuPDF: '',   // Ruta al PDF del menú cuando esté disponible
  logo: '/assets/logo.svg',
};

// Paleta de marca — se inyecta como CSS custom properties en :root
export const BRAND = {
  primary: '#E8420A',
  primaryDark: '#C43208',
  accent: '#F5A623',
  surface: '#111111',
  surfaceLight: '#1E1E1E',
  surfaceCard: '#1A1A1A',
  text: '#F5F5F5',
  textMuted: '#A0A0A0',
  fontDisplay: 'Nunito',
  fontBody: 'Nunito',
};

// Menú: categorías y productos
export const MENU = [
  {
    id: 'nuevos',
    name: 'Nuevos',
    emoji: '🆕',
    items: [
      {
        name: 'Sándwich Argentino',
        price: 13000,
        description: 'Pan artesanal, chorizo santarrosano, pico de gallo, chimichurri, queso y salsas de la casa.',
      },
      {
        name: 'Papas Locas',
        price: 12000,
        description: 'Doritos sabor nacho queso con chorizo, pico de gallo, maíz tierno, queso y salsas de la casa.',
      },
    ],
  },
  {
    id: 'perros-calientes',
    name: 'Perros Calientes',
    emoji: '🌭',
    items: [
      {
        name: 'El Sencillito',
        price: 13000,
        description: 'Pan artesanal, salchicha americana, cebolla, papa ripio, queso y salsas de la casa.',
      },
      {
        name: 'El Leñador',
        price: 15000,
        description: 'Pan artesanal, salchicha americana, cebolla, papa ripio, queso, tocineta crocante, huevo de codorniz y salsas de la casa.',
      },
      {
        name: 'El Hawaiano',
        price: 17000,
        description: 'Pan artesanal, salchicha americana, cebolla, papa ripio, queso, piña, jamón, huevo de codorniz y salsas de la casa.',
      },
    ],
  },
  {
    id: 'choriperros',
    name: 'Choriperros',
    emoji: '🔥',
    items: [
      {
        name: 'Choripán',
        price: 9000,
        description: 'Pan artesanal, chorizo, papa ripio y salsas de la casa.',
      },
      {
        name: 'Choriperro',
        price: 13000,
        description: 'Pan artesanal, chorizo, cebolla, papa ripio, queso, huevo de codorniz y salsas de la casa.',
      },
      {
        name: 'Choriperro Especial',
        price: 15000,
        description: 'Pan artesanal, chorizo, cebolla, papa ripio, queso, tocineta crocante, huevo de codorniz y salsas de la casa.',
      },
      {
        name: 'Choriarepa',
        price: 8000,
        description: 'Arepa de maíz doradita rellena de chorizo y salsas de la casa.',
      },
    ],
  },
];

// Combo: adicionando este valor a cualquier preparación, incluye papas y gaseosa
export const COMBO = {
  price: 6800,
  includes: 'Papas y gaseosa',
};

// Adiciona más sabor con desmechados (por 100 g)
export const EXTRAS = [
  { name: 'Carne Desmechada', unit: '100 g', price: 6000 },
  { name: 'Pollo Desmechado', unit: '100 g', price: 5500 },
];

// Adiciones para cualquier preparación
export const ADICIONES = [
  { name: 'Pepinillos', price: 2000 },
  { name: 'Jalapeños', price: 2000 },
  { name: 'Maíz', price: 2000 },
  { name: 'Tocineta Crispy', price: 2000 },
  { name: 'Salchicha', price: 5000 },
  { name: 'Huevo Codorniz', price: 1000 },
  { name: 'Piña Trozos', price: 2000 },
  { name: 'Queso', price: 2000 },
];

// Bebidas disponibles
export const BEBIDAS = [
  { name: 'Agua Brisa PET 600ml (24)', price: 2500 },
  { name: 'Fuze Negro Durazno PET 400ml (6)', price: 4500 },
  { name: 'Coca Cola 250 ml (12)', price: 3000 },
  { name: 'Fuze Mango M 400ml PET (6)', price: 4500 },
  { name: 'Sprite 400 ml NR', price: 4200 },
  { name: 'Cola Roman 400 ml NR', price: 4200 },
  { name: 'Quatro Choice 400ml (12)', price: 4000 },
  { name: 'Brisa Manzana 600 ml PET (6)', price: 4200 },
  { name: 'Coca Cola 400 ml PET (12)', price: 7500 },
  { name: 'Quatro Choice 1.5 lt PET (12)', price: 7500 },
  { name: 'Fresh Citrus 1.5 lt PET (12)', price: 7500 },
  { name: 'Coca Cola 1.5 lt PET (12)', price: 7500 },
  { name: 'Coca Cola Zero 400 ml PET (12)', price: 4200 },
  { name: 'Coca Cola Zero 250 ml PET (12)', price: 3000 },
];

// Tipos de chorizo disponibles (se muestra como nota en el menú)
export const CHORIZOS = [
  'Antioqueño',
  'Mexicano',
  'Ahumado',
  'Finas Hierbas',
  'Criollo',
  'Santarrosano',
];

// Sedes del comercio
export const LOCATIONS = [
  {
    id: 'sede-principal',
    name: 'Sede Principal',
    address: 'CR 54 D # 197 - 45, Conjunto Girasol Local 18',
    city: 'Bogotá',
    schedule: 'Domingo a Domingo · 10am-9pm',
    phone: '573219357262',   // formato internacional sin + ni espacios
    mapsUrl: 'https://maps.app.goo.gl/rHxKwt4hBCDv5vqn7',
    mapsQuery: '4.776926,-74.045492',   // coordenadas exactas para centrar el mapa embebido
  },
];

// Datos para pago con Llave (Bre-B / Daviplata)
export const PAYMENT = {
  llaveKey: '@1013259516',
  llaveName: 'Mateo',
  qrImage: 'assets/images/qr-llave.png',
};

// Redes sociales (vacías por ahora)
export const SOCIAL = {
  instagram: '',
  facebook: '',
  tiktok: '',
};
