import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { flavorVisuals } from '../data/content'

export const useThemeStore = defineStore('theme', () => {
  const activeFlavorIndex = ref(0)
  const activeFlavor = computed(() => flavorVisuals[activeFlavorIndex.value])

  function setFlavor(index) {
    activeFlavorIndex.value = index
    applyTheme(flavorVisuals[index])
  }

  function setFlavorById(id) {
    const idx = flavorVisuals.findIndex((f) => f.id === id)
    if (idx >= 0) setFlavor(idx)
  }

  function applyTheme(flavor) {
    const root = document.documentElement
    root.style.setProperty('--flavor-primary', flavor.primary)
    root.style.setProperty('--flavor-secondary', flavor.secondary)
    root.style.setProperty('--flavor-accent', flavor.accent)
    root.style.setProperty('--flavor-glow', flavor.glow)
    root.style.setProperty('--flavor-bg-color', flavor.bgColor || flavor.bg)
  }

  applyTheme(flavorVisuals[0])

  return { activeFlavorIndex, activeFlavor, setFlavor, setFlavorById, applyTheme }
})
