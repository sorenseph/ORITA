import { onMounted, onUnmounted } from 'vue'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance = null
let lenisRaf = null

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isCoarsePointer() {
  return typeof window !== 'undefined'
    && window.matchMedia('(pointer: coarse)').matches
}

export function getLenis() {
  return lenisInstance
}

export function useLenis() {
  let stTicking = false

  function onLenisScroll() {
    if (stTicking) return
    stTicking = true
    requestAnimationFrame(() => {
      ScrollTrigger.update()
      stTicking = false
    })
  }

  onMounted(() => {
    if (prefersReducedMotion() || isCoarsePointer()) return

    lenisInstance = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
    })

    lenisInstance.on('scroll', onLenisScroll)

    lenisRaf = (time) => {
      lenisInstance?.raf(time * 1000)
    }
    gsap.ticker.add(lenisRaf)

    document.documentElement.classList.add('lenis', 'lenis-smooth')
  })

  onUnmounted(() => {
    if (lenisRaf) {
      gsap.ticker.remove(lenisRaf)
      lenisRaf = null
    }
    lenisInstance?.destroy()
    lenisInstance = null
    document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped')
  })

  return { getLenis: () => lenisInstance }
}

export function scrollTo(target, options = {}) {
  const run = (resolved) => {
    if (lenisInstance) {
      lenisInstance.scrollTo(resolved, options)
    } else if (resolved instanceof Element) {
      resolved.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (typeof resolved === 'number') {
      window.scrollTo({ top: resolved, behavior: 'smooth' })
    }
  }

  if (target === 0 || target === '0') {
    run(0)
    return
  }

  if (typeof target === 'string') {
    const selector = target.startsWith('#') ? target : `#${target}`
    const el = document.querySelector(selector)
    if (el) {
      run(el)
      return
    }
    const deadline = Date.now() + 5000
    const poll = () => {
      const found = document.querySelector(selector)
      if (found) {
        run(found)
        return
      }
      if (Date.now() < deadline) requestAnimationFrame(poll)
    }
    requestAnimationFrame(poll)
    return
  }

  run(target)
}

export function stopScroll() {
  lenisInstance?.stop()
  document.documentElement.classList.add('lenis-stopped')
}

export function startScroll() {
  lenisInstance?.start()
  document.documentElement.classList.remove('lenis-stopped')
}

export { gsap, ScrollTrigger }
