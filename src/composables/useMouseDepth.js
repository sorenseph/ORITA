import { ref, onMounted, onUnmounted } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'

const mx = ref(0)
const my = ref(0)
let listeners = 0

function onMove(e) {
  const w = window.innerWidth
  const h = window.innerHeight
  mx.value = (e.clientX / w - 0.5) * 2
  my.value = (e.clientY / h - 0.5) * 2
}

export function useMouseDepth() {
  const reduced = usePreferredReducedMotion()

  onMounted(() => {
    if (reduced.value) return
    listeners += 1
    if (listeners === 1) {
      window.addEventListener('mousemove', onMove, { passive: true })
    }
  })

  onUnmounted(() => {
    listeners -= 1
    if (listeners <= 0) {
      listeners = 0
      window.removeEventListener('mousemove', onMove)
      mx.value = 0
      my.value = 0
    }
  })

  function parallax(depth = 1) {
    if (reduced.value) return { transform: 'none' }
    return {
      transform: `translate3d(${mx.value * depth * 8}px, ${my.value * depth * 6}px, 0)`,
    }
  }

  return { mx, my, parallax, reduced }
}
