import { ref, onMounted, onUnmounted } from 'vue'

/** Detects whether the nav sits over a dark or light surface. Returns nav tone: 'light' = light UI on dark bg, 'dark' = dark UI on light bg. */
export function useNavSurface(getAutoTone) {
  const navTone = ref('light')

  function update() {
    const probeY = 68
    const x = Math.min(window.innerWidth * 0.5, window.innerWidth - 24)
    const stack = document.elementsFromPoint(x, probeY)

    for (const el of stack) {
      if (el.closest('header')) continue

      const tagged = el.closest?.('[data-nav-contrast]')
      if (!tagged) continue

      const mode = tagged.dataset.navContrast
      if (mode === 'dark') {
        navTone.value = 'light'
        return
      }
      if (mode === 'light') {
        navTone.value = 'dark'
        return
      }
      if (mode === 'auto') {
        navTone.value = getAutoTone?.() === 'dark-text' ? 'dark' : 'light'
        return
      }
    }
  }

  onMounted(() => {
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
  })

  return { navTone, refresh: update }
}
