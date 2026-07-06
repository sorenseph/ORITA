import { ref, computed } from 'vue'
import { useMouse, usePreferredReducedMotion, useMediaQuery } from '@vueuse/core'
import gsap from 'gsap'

const mode = ref('default')
const flavorEmoji = ref('✨')
const visible = ref(false)

let outerX = null
let outerY = null
let innerX = null
let innerY = null
let initialized = false

export function useCustomCursor() {
  const { x, y } = useMouse()
  const reduced = usePreferredReducedMotion()
  const isFinePointer = useMediaQuery('(pointer: fine)')
  const active = computed(() => isFinePointer.value && !reduced.value)

  function init(outerEl, innerEl) {
    if (!active.value || !outerEl || !innerEl || initialized) return
    initialized = true

    outerX = gsap.quickTo(outerEl, 'x', { duration: 0.55, ease: 'power3.out' })
    outerY = gsap.quickTo(outerEl, 'y', { duration: 0.55, ease: 'power3.out' })
    innerX = gsap.quickTo(innerEl, 'x', { duration: 0.18, ease: 'power3.out' })
    innerY = gsap.quickTo(innerEl, 'y', { duration: 0.18, ease: 'power3.out' })

    visible.value = true
    document.body.classList.add('custom-cursor-active')
  }

  function update() {
    if (!active.value || !outerX) return
    outerX(x.value)
    outerY(y.value)
    innerX(x.value)
    innerY(y.value)
  }

  function setMode(next, emoji = '✨') {
    mode.value = next
    flavorEmoji.value = emoji
  }

  function destroy() {
    visible.value = false
    initialized = false
    document.body.classList.remove('custom-cursor-active')
    outerX = innerX = outerY = innerY = null
    mode.value = 'default'
  }

  return { x, y, mode, flavorEmoji, visible, active, init, update, setMode, destroy }
}
