import { onMounted, onUnmounted } from 'vue'
import { gsap } from './useLenis'

export function useBenefitHover(sectionRef) {
  let ctx

  onMounted(() => {
    const root = sectionRef.value
    if (!root || !window.matchMedia('(hover: hover)').matches) return

    ctx = gsap.context(() => {
      root.querySelectorAll('.benefit-card').forEach((card) => {
        const glow = card.querySelector('.benefit-card__glow')
        const detail = card.querySelector('.benefit-card__detail')

        const onEnter = () => {
          gsap.to(card, {
            y: -10,
            rotation: 2,
            scale: 1.02,
            boxShadow: '0 28px 64px rgba(42, 32, 24, 0.14)',
            duration: 0.55,
            ease: 'power3.out',
          })
          if (glow) gsap.to(glow, { opacity: 0.55, scale: 1.15, duration: 0.5, ease: 'power3.out' })
          if (detail) gsap.to(detail, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' })
        }

        const onLeave = () => {
          gsap.to(card, {
            y: 0,
            rotation: 0,
            scale: 1,
            boxShadow: '0 0 0 rgba(0,0,0,0)',
            duration: 0.65,
            ease: 'power3.out',
          })
          if (glow) gsap.to(glow, { opacity: 0.3, scale: 1, duration: 0.5 })
          if (detail) gsap.to(detail, { opacity: 0, y: 8, duration: 0.35 })
        }

        card.addEventListener('mouseenter', onEnter)
        card.addEventListener('mouseleave', onLeave)
      })
    }, root)
  })

  onUnmounted(() => {
    ctx?.revert()
  })
}
