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
    ],
  },
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
    schedule: 'Domingo a Domingo · Todo el día',
    phone: '573219357262',   // formato internacional sin + ni espacios
    mapsUrl: 'https://maps.google.com/?q=CR+54+D+%23+197-45+Bogota',
  },
];

// Redes sociales (vacías por ahora)
export const SOCIAL = {
  instagram: '',
  facebook: '',
  tiktok: '',
};
