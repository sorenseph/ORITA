import gsap from 'gsap'

const MODES = ['slide', 'fade', 'blur', 'rise']

/** Split editorial — cada palabra con animación distinta (sin SplitText de pago). */
export function editorialSplitWords(container, text, options = {}) {
  if (!container) return () => {}

  const {
    modes = MODES,
    stagger = 0.12,
    duration = 0.85,
    delay = 0,
    ease = 'power3.out',
  } = options

  const words = text.trim().split(/\s+/).filter(Boolean)
  container.innerHTML = ''
  container.setAttribute('aria-label', text)

  const tweens = []

  words.forEach((word, wi) => {
    const wrap = document.createElement('span')
    wrap.className = 'editorial-word inline-block overflow-hidden align-bottom'
    wrap.style.marginRight = '0.28em'

    const inner = document.createElement('span')
    inner.className = 'editorial-word__inner inline-block'
    inner.textContent = word

    const mode = modes[wi % modes.length]
    if (mode === 'blur') inner.style.filter = 'blur(12px)'
    if (mode === 'slide') inner.style.transform = 'translateY(110%)'
    if (mode === 'rise') inner.style.transform = 'translateY(-80%)'
    if (mode === 'fade') inner.style.opacity = '0'

    wrap.appendChild(inner)
    container.appendChild(wrap)

    const from = {}
    const to = { duration, delay: delay + wi * stagger, ease, clearProps: 'filter' }

    if (mode === 'blur') {
      from.filter = 'blur(12px)'
      to.filter = 'blur(0px)'
      to.opacity = 1
    } else if (mode === 'fade') {
      from.opacity = 0
      to.opacity = 1
    } else {
      from.y = mode === 'rise' ? '-80%' : '110%'
      to.y = '0%'
      to.opacity = 1
    }

    tweens.push(gsap.fromTo(inner, from, to))
  })

  return () => tweens.forEach((t) => t.kill())
}

/** Letras de marca — stagger con rotación sutil. */
export function editorialSplitChars(container, text, options = {}) {
  if (!container) return () => {}

  const { stagger = 0.055, duration = 0.7, delay = 0 } = options
  container.innerHTML = ''
  container.setAttribute('aria-label', text)

  const tweens = []
  const modes = ['slide', 'blur', 'fade', 'slide']

  ;[...text].forEach((char, i) => {
    const span = document.createElement('span')
    span.className = 'editorial-char inline-block'
    span.textContent = char === ' ' ? '\u00A0' : char

    const mode = modes[i % modes.length]
    if (mode === 'blur') {
      span.style.filter = 'blur(10px)'
      span.style.opacity = '0'
    } else if (mode === 'fade') {
      span.style.opacity = '0'
    } else {
      span.style.transform = 'translateY(105%) rotate(4deg)'
      span.style.opacity = '0'
    }

    container.appendChild(span)

    const from = {}
    const to = {
      opacity: 1,
      y: 0,
      rotation: 0,
      filter: 'blur(0px)',
      duration,
      delay: delay + i * stagger,
      ease: 'back.out(1.35)',
      clearProps: 'filter,transform',
    }

    if (mode === 'blur') {
      from.filter = 'blur(10px)'
      from.opacity = 0
    } else if (mode === 'fade') {
      from.opacity = 0
    } else {
      from.y = '105%'
      from.rotation = 4
      from.opacity = 0
    }

    tweens.push(gsap.fromTo(span, from, to))
  })

  return () => tweens.forEach((t) => t.kill())
}
