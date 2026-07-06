/** Paletas ambientales para secciones fuera del hero */

export const sectionAmbients = {
  sand: {
    gradient: ['#F7F0E3', '#EDE4D4', '#E8DCC8', '#F5EBD8'],
    particleHues: [38, 45, 52],
    bubbleTint: 'rgba(255, 240, 210, 0.2)',
    mist: 'rgba(255, 235, 200, 0.12)',
    wind: 0.75,
  },
  ocean: {
    gradient: ['#1A5C54', '#2A7A72', '#248F82', '#1f5c56'],
    particleHues: [155, 168, 175],
    bubbleTint: 'rgba(180, 255, 240, 0.18)',
    mist: 'rgba(160, 230, 220, 0.15)',
    wind: 0.9,
  },
  tropical: {
    gradient: ['#2A9E88', '#3BBFA3', '#4AAB9E', '#2A7A72'],
    particleHues: [145, 160, 170],
    bubbleTint: 'rgba(200, 255, 240, 0.22)',
    mist: 'rgba(180, 245, 230, 0.14)',
    wind: 1,
  },
}

export function getSectionAmbient(variant) {
  return sectionAmbients[variant] || sectionAmbients.sand
}
