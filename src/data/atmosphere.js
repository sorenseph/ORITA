/** Perfiles atmosféricos por sabor — iluminación, partículas, ambiente */

export const flavorAtmosphere = {
  tamarind: {
    glow: 'rgba(212, 115, 74, 0.42)',
    gradient: ['#6B2E1F', '#C45C3E', '#E8A050', '#F7D4A0'],
    lightColor: '#FFB87A',
    mist: 'rgba(255, 190, 140, 0.18)',
    cloud: 'rgba(255, 210, 170, 0.22)',
    particleHues: [12, 22, 32],
    bubbleTint: 'rgba(255, 200, 150, 0.28)',
    wind: 1.15,
    mood: 'sunset',
    agaveOpacity: 0.18,
    agaveWallOpacity: 0.08,
  },
  guava: {
    glow: 'rgba(232, 200, 74, 0.45)',
    gradient: ['#C9A020', '#E8C84A', '#F5E6A8', '#FFF4D6'],
    lightColor: '#FFE566',
    mist: 'rgba(255, 240, 180, 0.16)',
    cloud: 'rgba(255, 248, 210, 0.2)',
    particleHues: [45, 52, 38],
    bubbleTint: 'rgba(255, 230, 150, 0.25)',
    wind: 0.95,
    mood: 'golden-hour',
    agaveOpacity: 0.16,
    agaveWallOpacity: 0.07,
  },
  lime: {
    glow: 'rgba(74, 171, 158, 0.4)',
    gradient: ['#1A5C54', '#2A8F82', '#4AAB9E', '#A8E6DC'],
    lightColor: '#7FE8D8',
    mist: 'rgba(180, 240, 230, 0.2)',
    cloud: 'rgba(200, 245, 240, 0.18)',
    particleHues: [155, 168, 175],
    bubbleTint: 'rgba(180, 255, 240, 0.3)',
    wind: 1.05,
    mood: 'crystal-water',
    agaveOpacity: 0.2,
    agaveWallOpacity: 0.09,
  },
  hibiscus: {
    glow: 'rgba(212, 86, 130, 0.42)',
    gradient: ['#7A2048', '#B83A6B', '#D45682', '#F8C4D8'],
    lightColor: '#FF9EC4',
    mist: 'rgba(255, 180, 210, 0.17)',
    cloud: 'rgba(255, 200, 220, 0.2)',
    particleHues: [320, 335, 350],
    bubbleTint: 'rgba(255, 180, 210, 0.26)',
    wind: 0.88,
    mood: 'tropical-dusk',
    agaveOpacity: 0.17,
    agaveWallOpacity: 0.075,
  },
}

export function getAtmosphere(flavorId) {
  return flavorAtmosphere[flavorId] || flavorAtmosphere.lime
}
