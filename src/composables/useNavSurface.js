import { ref, onMounted, onUnmounted } from 'vue'
import { getLenis } from './useLenis'

/** Detects whether the nav sits over a dark or light surface. Returns nav tone: 'light' = light UI on dark bg, 'dark' = dark UI on light bg. */
export function useNavSurface(getAutoTone, isPaused) {
  const navTone = ref('dark')
  const inHero = ref(true)
  let rafId = 0

  function resolveTone() {
    const hero = document.getElementById('hero')
    if (hero) {
      const rect = hero.getBoundingClientRect()
      inHero.value = rect.bottom > 80
    } else {
      inHero.value = window.scrollY < window.innerHeight * 0.85
    }

    if (inHero.value) return

    const probeY = 72
    const x = window.innerWidth * 0.5
    const stack = document.elementsFromPoint(x, probeY)

    for (const el of stack) {
      if (el.closest('header, [data-nav-menu]')) continue

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

    navTone.value = 'dark'
  }

  function update() {
    if (isPaused?.()) return
    cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(resolveTone)
  }

  onMounted(() => {
    resolveTone()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    getLenis()?.on('scroll', update)
  })

  onUnmounted(() => {
    cancelAnimationFrame(rafId)
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
    getLenis()?.off('scroll', update)
  })

  return { navTone, inHero, refresh: update }
}
