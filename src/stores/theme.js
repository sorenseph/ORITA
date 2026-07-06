import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import gsap from 'gsap'
import { flavorVisuals } from '../data/content'
import { getAtmosphere } from '../data/atmosphere'
import { lerpColor } from '../utils/color'

const root = typeof document !== 'undefined' ? document.documentElement : null

const themeProxy = {
  primary: flavorVisuals[0].primary,
  secondary: flavorVisuals[0].secondary,
  accent: flavorVisuals[0].accent,
  bg: flavorVisuals[0].bgColor,
  glow: getAtmosphere(flavorVisuals[0].id).glow,
}

export const useThemeStore = defineStore('theme', () => {
  const activeFlavorIndex = ref(0)
  const activeFlavor = computed(() => flavorVisuals[activeFlavorIndex.value])
  const isTransitioning = ref(false)

  function writeVars() {
    if (!root) return
    root.style.setProperty('--flavor-primary', themeProxy.primary)
    root.style.setProperty('--flavor-secondary', themeProxy.secondary)
    root.style.setProperty('--flavor-accent', themeProxy.accent)
    root.style.setProperty('--flavor-bg', themeProxy.bg)
    root.style.setProperty('--flavor-bg-color', themeProxy.bg)
    root.style.setProperty('--flavor-glow', themeProxy.glow)
  }

  function applyTheme(flavor, animate = true) {
    const atmo = getAtmosphere(flavor.id)
    const next = {
      primary: flavor.primary,
      secondary: flavor.secondary,
      accent: flavor.accent,
      bg: flavor.bgColor || flavor.bg,
      glow: atmo.glow,
    }

    if (!animate || !root) {
      Object.assign(themeProxy, next)
      writeVars()
      return
    }

    isTransitioning.value = true
    const from = { ...themeProxy }
    const proxy = { t: 0 }

    gsap.to(proxy, {
      t: 1,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        themeProxy.primary = lerpColor(from.primary, next.primary, proxy.t)
        themeProxy.secondary = lerpColor(from.secondary, next.secondary, proxy.t)
        themeProxy.accent = lerpColor(from.accent, next.accent, proxy.t)
        themeProxy.bg = lerpColor(from.bg, next.bg, proxy.t)
        themeProxy.glow = next.glow
        writeVars()
      },
      onComplete: () => {
        Object.assign(themeProxy, next)
        writeVars()
        isTransitioning.value = false
      },
    })
  }

  function setFlavor(index) {
    if (index < 0 || index >= flavorVisuals.length) return
    if (index === activeFlavorIndex.value) return
    activeFlavorIndex.value = index
    applyTheme(flavorVisuals[index])
  }

  function setFlavorById(id) {
    const idx = flavorVisuals.findIndex((f) => f.id === id)
    if (idx >= 0) setFlavor(idx)
  }

  applyTheme(flavorVisuals[0], false)

  return { activeFlavorIndex, activeFlavor, isTransitioning, setFlavor, setFlavorById, applyTheme }
})
