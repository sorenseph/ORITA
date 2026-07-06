import { onMounted, onUnmounted } from 'vue'
import { gsap } from './useLenis'

/** Scroll reveals estilo motion.page / MotionSites */
export function useMotionReveal(containerRef, selector = '.motion-reveal', options = {}) {
  const {
    y = 48,
    stagger = 0.08,
    start = 'top 85%',
    once = true,
  } = options

  let ctx

  onMounted(() => {
    if (!containerRef.value) return
    ctx = gsap.context(() => {
      gsap.from(selector, {
        y,
        opacity: 0,
        duration: 1,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.value,
          start,
          once,
        },
        clearProps: 'opacity,transform',
      })
    }, containerRef)
  })

  onUnmounted(() => ctx?.revert())
}

/** Float suave continuo — botellas, ingredientes */
export function useFloatAnimation(targetRef, { y = 14, duration = 3.2, delay = 0 } = {}) {
  let tween

  onMounted(() => {
    if (!targetRef.value) return
    tween = gsap.to(targetRef.value, {
      y: `-=${y}`,
      duration,
      delay,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })
  })

  onUnmounted(() => tween?.kill())
}
