import { onMounted, onUnmounted } from 'vue'
import { magneticButton } from './useAnimations'

/**
 * Interacciones de sección: solo botones magnéticos (sin flotación continua).
 */
export function useSectionLife(sectionRef, options = {}) {
  const { magneticSelector = '.magnetic-btn' } = options
  const cleanups = []

  onMounted(() => {
    const root = sectionRef.value
    if (!root) return

    root.querySelectorAll(magneticSelector).forEach((el) => {
      const off = magneticButton(el)
      if (off) cleanups.push(off)
    })
  })

  onUnmounted(() => {
    cleanups.forEach((fn) => fn?.())
  })
}
