import { onMounted, watch, nextTick } from 'vue'
import gsap from 'gsap'

export function useSplitReveal(containerRef, textRef, options = {}) {
  const { stagger = 0.04, duration = 0.55, delay = 0 } = options
  let ctx = null

  function splitAndAnimate() {
    const container = containerRef.value
    const source = textRef.value
    if (!container || !source) return

    ctx?.revert()
    const text = source.textContent || ''
    container.innerHTML = ''
    container.setAttribute('aria-label', text)

    const chars = [...text]
    chars.forEach((char, i) => {
      const span = document.createElement('span')
      span.className = 'split-char inline-block'
      span.textContent = char === ' ' ? '\u00A0' : char
      span.style.opacity = '0'
      span.style.transform = 'translateY(110%) rotate(4deg)'
      container.appendChild(span)

      gsap.to(span, {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration,
        delay: delay + i * stagger,
        ease: 'back.out(1.4)',
      })

      gsap.to(span, {
        y: -3,
        duration: 1.8 + (i % 3) * 0.2,
        delay: delay + i * stagger + duration,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    })
  }

  onMounted(() => nextTick(splitAndAnimate))

  watch(textRef, () => nextTick(splitAndAnimate))

  return { replay: splitAndAnimate }
}
