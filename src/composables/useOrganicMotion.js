import { onUnmounted } from 'vue'
import gsap from 'gsap'

/** Movimiento orgánico — variaciones lentas, nunca mecánicas */
export function useOrganicMotion() {
  const tweens = []

  function track(tween) {
    tweens.push(tween)
    return tween
  }

  function float(el, opts = {}) {
    if (!el) return null
    const {
      y = 10,
      x = 0,
      rotate = 2,
      duration = 4.5,
      delay = 0,
    } = opts
    const dur = duration + Math.random() * 1.8
    return track(
      gsap.to(el, {
        y: `+=${y}`,
        x: x ? `+=${x}` : 0,
        rotation: `+=${rotate}`,
        duration: dur,
        delay: delay + Math.random() * 0.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      }),
    )
  }

  function breathe(el, opts = {}) {
    if (!el) return null
    const { scale = 0.025, duration = 5.5, delay = 0 } = opts
    return track(
      gsap.to(el, {
        scale: 1 + scale,
        duration: duration + Math.random(),
        delay,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      }),
    )
  }

  function sway(el, opts = {}) {
    if (!el) return null
    const { x = 14, rotate = 6, duration = 7, delay = 0 } = opts
    return track(
      gsap.to(el, {
        x: `+=${x}`,
        rotation: `+=${rotate}`,
        duration: duration + Math.random() * 2,
        delay: delay + Math.random(),
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      }),
    )
  }

  function slowSpin(el, opts = {}) {
    if (!el) return null
    const { degrees = 360, duration = 120, delay = 0 } = opts
    return track(
      gsap.to(el, {
        rotation: `+=${degrees}`,
        duration,
        delay,
        ease: 'none',
        repeat: -1,
      }),
    )
  }

  function killAll() {
    tweens.forEach((t) => t.kill())
    tweens.length = 0
  }

  onUnmounted(killAll)

  return { float, breathe, sway, slowSpin, killAll }
}
