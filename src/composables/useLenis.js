import { onMounted, onUnmounted } from 'vue'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })

const SMOOTH_WHEEL = false

let lenisInstance = null
let lenisRaf = null
let scrollListener = null

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
  onMounted(() => {
    if (prefersReducedMotion() || isCoarsePointer()) return

    lenisInstance = new Lenis({
      duration: 0.65,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: SMOOTH_WHEEL,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      infinite: false,
    })

    if (SMOOTH_WHEEL) {
      const root = document.documentElement
      ScrollTrigger.scrollerProxy(root, {
        scrollTop(value) {
          if (arguments.length) {
            lenisInstance.scrollTo(value, { immediate: true, force: true })
          }
          return lenisInstance.scroll
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          }
        },
        pinType: root.style.transform ? 'transform' : 'fixed',
      })
      ScrollTrigger.defaults({ scroller: root })
      lenisInstance.on('scroll', ScrollTrigger.update)
    } else {
      scrollListener = () => ScrollTrigger.update()
      window.addEventListener('scroll', scrollListener, { passive: true })
    }

    lenisRaf = (time) => {
      lenisInstance?.raf(time * 1000)
    }
    gsap.ticker.add(lenisRaf)
    gsap.ticker.lagSmoothing(0)

    document.documentElement.classList.add('lenis', 'lenis-smooth')
    requestAnimationFrame(() => ScrollTrigger.refresh())
  })

  onUnmounted(() => {
    if (scrollListener) {
      window.removeEventListener('scroll', scrollListener)
      scrollListener = null
    }
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
