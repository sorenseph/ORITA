import { onMounted, onUnmounted } from 'vue'
import { gsap, ScrollTrigger } from './useLenis'

/**
 * En desktop, fija la sección de sabores y avanza el índice con el scroll (sin autoplay).
 */
export function useScrollFlavorDrive(sectionRef, options = {}) {
  const {
    count = 4,
    getCount,
    onChange,
    minWidth = 768,
    scrollPerFlavor = 85,
  } = options

  const resolveCount = () => (getCount ? getCount() : count)

  let mm = null
  let lastIndex = -1

  onMounted(() => {
    const el = sectionRef.value
    if (!el) return

    mm = gsap.matchMedia()

    mm.add(`(min-width: ${minWidth}px)`, () => {
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: `+=${resolveCount() * scrollPerFlavor}%`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.55,
        onUpdate: (self) => {
          const total = resolveCount()
          const idx = Math.min(total - 1, Math.floor(self.progress * total))
          if (idx !== lastIndex) {
            lastIndex = idx
            onChange?.(idx, self.progress)
          }
        },
      })

      return () => {
        trigger.kill()
        lastIndex = -1
      }
    })
  })

  onUnmounted(() => {
    mm?.revert()
  })
}
