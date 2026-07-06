import { ref, onMounted, onUnmounted } from 'vue'
import { getLenis } from './useLenis'

/** Detects whether the nav sits over a dark or light surface. Returns nav tone: 'light' = light UI on dark bg, 'dark' = dark UI on light bg. */
export function useNavSurface(getAutoTone, isPaused) {
  const navTone = ref('dark')
  const inHero = ref(true)
  let rafId = 0
  let lastRun = 0
  const THROTTLE_MS = 120

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
    const now = performance.now()
    if (now - lastRun < THROTTLE_MS) return
    cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      lastRun = performance.now()
      resolveTone()
    })
  }

  onMounted(() => {
    resolveTone()
    const lenis = getLenis()
    if (lenis) {
      lenis.on('scroll', update)
    } else {
      window.addEventListener('scroll', update, { passive: true })
    }
    window.addEventListener('resize', update, { passive: true })
  })

  onUnmounted(() => {
    cancelAnimationFrame(rafId)
    const lenis = getLenis()
    if (lenis) {
      lenis.off('scroll', update)
    } else {
      window.removeEventListener('scroll', update)
    }
    window.removeEventListener('resize', update)
  })

  return { navTone, inHero, refresh: update }
}
