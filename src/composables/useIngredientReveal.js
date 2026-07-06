import { onMounted, onUnmounted } from 'vue'
import { gsap } from './useLenis'

/**
 * Ingredientes que emergen del suelo con rotación suave al entrar en viewport.
 */
export function useIngredientReveal(containerRef) {
  let ctx

  onMounted(() => {
    const root = containerRef.value
    if (!root) return

    ctx = gsap.context(() => {
      root.querySelectorAll('[data-ingredient-reveal]').forEach((el, i) => {
        const icon = el.querySelector('[data-ingredient-icon]')
        const copy = el.querySelector('[data-ingredient-copy]')

        gsap.set(el, { transformOrigin: 'bottom center' })
        if (icon) gsap.set(icon, { transformOrigin: 'bottom center' })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            once: true,
          },
        })

        tl.from(el, {
          y: 72,
          opacity: 0,
          rotation: 6,
          duration: 0.95,
          ease: 'back.out(1.35)',
          delay: i * 0.06,
        })

        if (icon) {
          tl.from(
            icon,
            { y: 48, scale: 0.6, rotation: -12, opacity: 0, duration: 0.75, ease: 'power3.out' },
            '-=0.65',
          )
        }

        if (copy) {
          tl.from(copy, { y: 16, opacity: 0, duration: 0.55, ease: 'power3.out' }, '-=0.35')
        }
      })
    }, root)
  })

  onUnmounted(() => {
    ctx?.revert()
  })
}
