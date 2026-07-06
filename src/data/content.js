/** Datos visuales — textos viven en i18n */

export const flavorVisuals = [
  {
    id: 'tamarind',
    bottle: '/images/bottle_1.webp',
    title: '/images/title-chile.webp',
    product: '/images/productos_tam1.webp',
    primary: '#C45C3E',
    secondary: '#D4734A',
    accent: '#F4E4D4',
    bgColor: '#D4734A',
    bg: '#D4734A',
    waveColor: '#F7F0E3',
    textOnBg: '#FFFFFF',
    liquid: '#E63946',
    audio: { fizz: 180, warmth: 220 },
    ingredients: [
      { img: '/recursos/tamarindo/tamarindo.png', key: 'tamarind' },
      { img: '/recursos/chiles/chiles1.png', key: 'chili' },
      { img: '/recursos/tamarindo/tamarindo2.png', key: 'pulp' },
    ],
    collage: [
      { img: '/recursos/tamarindo/tamarindo.png', top: '16%', left: '-6%', w: 150, rotate: -10, delay: 0 },
      { img: '/recursos/chiles/chiles1.png', top: '6%', right: '-4%', w: 110, rotate: 14, delay: 0.15 },
      { img: '/recursos/tamarindo/tamarindo2.png', bottom: '10%', left: '4%', w: 130, rotate: 6, delay: 0.3 },
      { img: '/recursos/chiles/chiles3.png', bottom: '6%', right: '2%', w: 100, rotate: -8, delay: 0.25 },
    ],
    emoji: '🌶️',
  },
  {
    id: 'guava',
    bottle: '/images/bottle_2.webp',
    title: '/images/title-guayaba.webp',
    product: '/images/productos_guayaba1.webp',
    primary: '#C2185B',
    secondary: '#D4567A',
    accent: '#FFF8E7',
    bgColor: '#E8C84A',
    bg: '#E8C84A',
    waveColor: '#FFF8E7',
    textOnBg: '#2A2018',
    liquid: '#F72585',
    audio: { fizz: 240, warmth: 280 },
    ingredients: [
      { img: '/images/guayaba1.png', key: 'guava' },
      { img: '/images/galanga1.png', key: 'galanga' },
      { img: '/images/guayaba2.png', key: 'pulp' },
    ],
    collage: [
      { img: '/recursos/hojas/hoja3.png', top: '8%', left: '-8%', w: 140, rotate: -8, delay: 0 },
      { img: '/images/guayaba1.png', top: '26%', left: '0%', w: 120, rotate: 5, delay: 0.15 },
      { img: '/recursos/hojas/hoja1.png', top: '4%', right: '-6%', w: 130, rotate: 12, delay: 0.2 },
      { img: '/images/guayaba2.png', bottom: '4%', left: '48%', w: 150, rotate: -4, delay: 0.35, centerX: true },
    ],
    emoji: '🌺',
  },
  {
    id: 'lime',
    bottle: '/images/bottle_3.webp',
    title: '/images/title-limon.webp',
    product: '/images/productos_limon1.webp',
    primary: '#2A8F82',
    secondary: '#4AAB9E',
    accent: '#E8F6F3',
    bgColor: '#4AAB9E',
    bg: '#4AAB9E',
    waveColor: '#E8F6F3',
    textOnBg: '#FFFFFF',
    liquid: '#06D6A0',
    audio: { fizz: 320, warmth: 400 },
    ingredients: [
      { img: '/recursos/limones/1limon.png', key: 'lime' },
      { img: '/recursos/limones/hojalimon.png', key: 'mint' },
      { img: '/recursos/limones/4limon.png', key: 'pulp' },
    ],
    collage: [
      { img: '/recursos/limones/1limon.png', top: '12%', left: '-6%', w: 120, rotate: -14, delay: 0 },
      { img: '/recursos/limones/hojalimon.png', top: '8%', right: '-4%', w: 110, rotate: 10, delay: 0.1 },
      { img: '/recursos/limones/3limon.png', top: '30%', left: '2%', w: 100, rotate: 8, delay: 0.2 },
      { img: '/recursos/limones/2hojalimon.png', bottom: '8%', right: '0%', w: 105, rotate: -10, delay: 0.3 },
    ],
    emoji: '🍋',
  },
  {
    id: 'hibiscus',
    bottle: '/images/bottle_4.webp',
    title: '/images/title-jamaica.webp',
    product: '/images/productos_jamaica1.webp',
    primary: '#B83A6B',
    secondary: '#D45682',
    accent: '#FCE8EF',
    bgColor: '#D45682',
    bg: '#D45682',
    waveColor: '#FCE8EF',
    textOnBg: '#FFFFFF',
    liquid: '#9B5DE5',
    audio: { fizz: 200, warmth: 260 },
    ingredients: [
      { img: '/images/jamaica1.png', key: 'hibiscus' },
      { img: '/images/romero1.png', key: 'rosemary' },
      { img: '/images/jamaica2.png', key: 'flowers' },
    ],
    collage: [
      { img: '/images/jamaica1.png', top: '6%', left: '-5%', w: 130, rotate: -8, delay: 0 },
      { img: '/recursos/romero/rosemary2.png', top: '10%', right: '-3%', w: 120, rotate: 12, delay: 0.15 },
      { img: '/images/jamaica2.png', bottom: '6%', right: '0%', w: 110, rotate: -9, delay: 0.35 },
    ],
    emoji: '🌸',
  },
]

export const flavors = flavorVisuals

export const storyStepIds = ['water', 'agave', 'fruit', 'bubble', 'orita']
export const labIngredientIds = ['agave', 'mineral', 'fruit', 'inulin', 'herbs', 'zero-cane']
export const benefitIds = ['calories', 'sugar', 'fiber', 'natural']
export const locationIds = ['gdl', 'puerto-vallarta', 'tequila', 'bcs', 'oaxaca', 'cancun', 'north', 'pacific', 'gulf']

export const mapConnections = [
  ['gdl', 'puerto-vallarta'],
  ['gdl', 'tequila'],
  ['gdl', 'bcs'],
  ['gdl', 'oaxaca'],
  ['gdl', 'cancun'],
  ['north', 'gdl'],
  ['pacific', 'puerto-vallarta'],
  ['gulf', 'cancun'],
]

/** Coordenadas SVG (viewBox 606.73 × 416.78) — ancladas a puntos del map-mexico.svg */
export const mapMarkers = [
  { id: 'gdl', svgX: 203.11, svgY: 160.9, stores: 22, type: 'dot', region: 'jalisco' },
  { id: 'puerto-vallarta', svgX: 150.35, svgY: 160.9, stores: 8, type: 'dot', region: 'jalisco' },
  { id: 'tequila', svgX: 160.9, svgY: 160.9, stores: 6, type: 'dot', region: 'jalisco' },
  { id: 'bcs', svgX: 129.24, svgY: 76.48, stores: 10, type: 'region', region: 'bcs' },
  { id: 'oaxaca', svgX: 213.67, svgY: 298.09, stores: 8, type: 'region', region: 'oaxaca' },
  { id: 'cancun', svgX: 561.9, svgY: 298.09, stores: 12, type: 'region', region: 'cancun' },
  { id: 'north', svgX: 203.11, svgY: 97.59, stores: 15, type: 'ring', region: 'north' },
  { id: 'pacific', svgX: 65.93, svgY: 97.59, stores: 18, type: 'ring', region: 'pacific' },
  { id: 'gulf', svgX: 435.27, svgY: 329.74, stores: 14, type: 'ring', region: 'gulf' },
]

export const flavorPackIds = {
  tamarind: 'pack-12-tamarind',
  guava: 'pack-12-guava',
  lime: 'pack-12-lime',
  hibiscus: 'pack-12-hibiscus',
}

export function getPackIdForFlavor(flavorId) {
  return flavorPackIds[flavorId] || 'pack-12-discovery'
}

export const testimonialMeta = [
  { id: 1, name: 'María González', handle: '@mariag_mx', avatar: 'https://i.pravatar.cc/150?img=5', flavor: 'tamarind', likes: 2847 },
  { id: 2, name: 'Carlos Ruiz', handle: '@carlosruiz_food', avatar: 'https://i.pravatar.cc/150?img=11', flavor: 'guava', likes: 1923 },
  { id: 3, name: 'Ana Torres', handle: '@anatorres_wellness', avatar: 'https://i.pravatar.cc/150?img=9', flavor: 'lime', likes: 3456 },
  { id: 4, name: 'Diego Mendoza', handle: '@diegom_chef', avatar: 'https://i.pravatar.cc/150?img=12', flavor: 'hibiscus', likes: 4102 },
  { id: 5, name: 'Sofia Herrera', handle: '@sofiah_mx', avatar: 'https://i.pravatar.cc/150?img=16', flavor: 'hibiscus', likes: 2678 },
]

export const instagramFallback = [
  { id: 1, image: '/images/productos_tam1.webp', likes: 1240, captionKey: 'tam', permalink: 'https://www.instagram.com/drinkorita/' },
  { id: 2, image: '/images/productos_guayaba1.webp', likes: 987, captionKey: 'guava', permalink: 'https://www.instagram.com/drinkorita/' },
  { id: 3, image: '/images/productos_limon1.webp', likes: 1567, captionKey: 'lime', permalink: 'https://www.instagram.com/drinkorita/' },
  { id: 4, image: '/images/productos_jamaica1.webp', likes: 2103, captionKey: 'hibiscus', permalink: 'https://www.instagram.com/drinkorita/' },
  { id: 5, image: '/images/bottle_1.webp', likes: 3421, captionKey: 'bottle1', permalink: 'https://www.instagram.com/drinkorita/' },
  { id: 6, image: '/images/bottle_2.webp', likes: 876, captionKey: 'bottle2', permalink: 'https://www.instagram.com/drinkorita/' },
  { id: 7, image: '/images/medals.png', likes: 4532, captionKey: 'awards', permalink: 'https://www.instagram.com/drinkorita/' },
  { id: 8, image: '/images/bottle_3.webp', likes: 1098, captionKey: 'bottle3', permalink: 'https://www.instagram.com/drinkorita/' },
]

export const instagramCaptions = {
  es: {
    tam: 'Agave Pop. Hecho en México. 🌶️',
    guava: 'Vibras tropicales 🌺',
    lime: 'Fresco como el mercado 🍋',
    hibiscus: 'Floral y familiar 🌸',
    bottle1: 'La botella habla sola',
    bottle2: 'Hora rosa 🩷',
    awards: 'Diseño premiado ✨',
    bottle3: 'Fresco de verdad 😎',
  },
  en: {
    tam: 'Agave Pop. Made in Mexico. 🌶️',
    guava: 'Tropical vibes only 🌺',
    lime: 'Fresh like the mercado 🍋',
    hibiscus: 'Floral & familiar 🌸',
    bottle1: 'The bottle speaks for itself',
    bottle2: 'Pink hour 🩷',
    awards: 'Award-winning design ✨',
    bottle3: 'Mint condition 😎',
  },
}

export const productVisuals = [
  {
    id: 'pack-12-tamarind',
    type: 'pack',
    flavorId: 'tamarind',
    price: 389,
    bottles: 12,
    volumeMl: 355,
    weightKg: 7.65,
    image: '/images/productos_tam1.webp',
    badgeKey: 'Popular',
    highlightIds: ['agave', 'calories', 'natural', 'glass', 'share'],
    specKeys: ['pack', 'volume', 'weight', 'calories', 'ingredients', 'origin', 'caffeine'],
  },
  {
    id: 'pack-12-guava',
    type: 'pack',
    flavorId: 'guava',
    price: 389,
    bottles: 12,
    volumeMl: 355,
    weightKg: 7.65,
    image: '/images/productos_guayaba1.webp',
    highlightIds: ['agave', 'calories', 'natural', 'glass', 'share'],
    specKeys: ['pack', 'volume', 'weight', 'calories', 'ingredients', 'origin', 'caffeine'],
  },
  {
    id: 'pack-12-lime',
    type: 'pack',
    flavorId: 'lime',
    price: 389,
    bottles: 12,
    volumeMl: 355,
    weightKg: 7.65,
    image: '/images/productos_limon1.webp',
    highlightIds: ['agave', 'calories', 'natural', 'glass', 'share'],
    specKeys: ['pack', 'volume', 'weight', 'calories', 'ingredients', 'origin', 'caffeine'],
  },
  {
    id: 'pack-12-hibiscus',
    type: 'pack',
    flavorId: 'hibiscus',
    price: 389,
    bottles: 12,
    volumeMl: 355,
    weightKg: 7.65,
    image: '/images/productos_jamaica1.webp',
    highlightIds: ['agave', 'calories', 'natural', 'glass', 'share'],
    specKeys: ['pack', 'volume', 'weight', 'calories', 'ingredients', 'origin', 'caffeine'],
  },
  {
    id: 'pack-12-discovery',
    type: 'pack',
    flavorId: null,
    price: 389,
    bottles: 12,
    volumeMl: 355,
    weightKg: 7.65,
    image: '/images/bottle_1.webp',
    badgeKey: 'Discovery',
    highlightIds: ['agave', 'calories', 'natural', 'glass', 'variety'],
    specKeys: ['pack', 'volume', 'weight', 'calories', 'ingredients', 'origin', 'caffeine'],
  },
]

export const products = productVisuals

export const SHIPPING_COST = 99
export const FREE_SHIPPING_THRESHOLD = 500
