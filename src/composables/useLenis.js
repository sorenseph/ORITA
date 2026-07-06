import { onMounted, onUnmounted } from 'vue'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance = null

export function getLenis() {
  return lenisInstance
}

export function useLenis() {
  onMounted(() => {
    lenisInstance = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    lenisInstance.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    document.documentElement.classList.add('lenis', 'lenis-smooth')
  })

  onUnmounted(() => {
    if (lenisInstance) {
      lenisInstance.destroy()
      lenisInstance = null
    }
    gsap.ticker.remove(lenisInstance?.raf)
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
    // Esperar secciones lazy/async (p. ej. #shop)
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
