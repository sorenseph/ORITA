import { gsap } from './useLenis'

export function fadeUp(el, options = {}) {
  const { delay = 0, duration = 1, y = 80, stagger = 0 } = options
  return gsap.from(el, {
    y,
    opacity: 0,
    duration,
    delay,
    stagger,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  })
}

export function revealText(el, options = {}) {
  const { delay = 0 } = options
  return gsap.from(el, {
    y: '100%',
    opacity: 0,
    duration: 1.2,
    delay,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
    },
  })
}

export function parallax(el, speed = 0.3) {
  return gsap.to(el, {
    y: () => window.innerHeight * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
}

export function magneticButton(el) {
  if (!el) return

  const onMove = (e) => {
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' })
  }

  const onLeave = () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  }

  el.addEventListener('mousemove', onMove)
  el.addEventListener('mouseleave', onLeave)

  return () => {
    el.removeEventListener('mousemove', onMove)
    el.removeEventListener('mouseleave', onLeave)
  }
}

export function countUp(el, endValue, options = {}) {
  const obj = { val: 0 }
  return gsap.to(obj, {
    val: endValue,
    duration: options.duration || 2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 80%',
    },
    onUpdate: () => {
      if (el) {
        el.textContent = options.decimals
          ? obj.val.toFixed(options.decimals)
          : Math.round(obj.val)
      }
    },
  })
}
