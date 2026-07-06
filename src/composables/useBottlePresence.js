import { onMounted, onUnmounted, watch } from 'vue'
import { useMouse } from '@vueuse/core'
import { usePreferredReducedMotion } from '@vueuse/core'
import gsap from 'gsap'

/**
 * Botella viva: idle 12s (±5px, ±2°) + tilt al mouse (8° X, 5° Y).
 */
export function useBottlePresence(stageRef, tiltRef, options = {}) {
  const { enabled = true, idleDuration = 12 } = options
  const { x, y } = useMouse()
  const reduced = usePreferredReducedMotion()

  let idleTween = null
  let raf = 0

  function startIdle() {
    const el = stageRef.value
    if (!el || reduced.value || !enabled) return

    idleTween?.kill()
    gsap.set(el, { y: 0, rotation: 0 })

    idleTween = gsap.timeline({ repeat: -1, defaults: { ease: 'sine.inOut' } })
    idleTween
      .to(el, { y: -5, rotation: 2, duration: idleDuration * 0.25 })
      .to(el, { y: 5, rotation: -1, duration: idleDuration * 0.25 })
      .to(el, { y: 0, rotation: 0, duration: idleDuration * 0.25 })
      .to(el, { duration: idleDuration * 0.25 })
  }

  function applyTilt() {
    const el = tiltRef?.value || stageRef.value
    if (!el || reduced.value || !enabled) return

    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const dx = (x.value - cx) / cx
    const dy = (y.value - cy) / cy

    gsap.to(el, {
      rotateY: dx * 8,
      rotateX: -dy * 5,
      duration: 0.65,
      ease: 'power3.out',
      transformPerspective: 900,
    })
  }

  function loop() {
    applyTilt()
    raf = requestAnimationFrame(loop)
  }

  onMounted(() => {
    startIdle()
    if (!reduced.value && enabled) raf = requestAnimationFrame(loop)
  })

  onUnmounted(() => {
    idleTween?.kill()
    cancelAnimationFrame(raf)
  })

  watch(reduced, (v) => {
    if (v) {
      idleTween?.kill()
      cancelAnimationFrame(raf)
    } else {
      startIdle()
      raf = requestAnimationFrame(loop)
    }
  })

  return { restart: startIdle }
}
