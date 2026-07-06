import { ref, onMounted, onUnmounted } from 'vue'

/** Pausa animaciones cuando el elemento sale del viewport. */
export function useVisibilityPause(targetRef, options = {}) {
  const isVisible = ref(true)
  const { rootMargin = '80px', threshold = 0.05 } = options
  let observer = null

  onMounted(() => {
    const el = targetRef.value
    if (!el || typeof IntersectionObserver === 'undefined') return

    observer = new IntersectionObserver(
      ([entry]) => { isVisible.value = entry.isIntersecting },
      { rootMargin, threshold },
    )
    observer.observe(el)
  })

  onUnmounted(() => observer?.disconnect())

  return { isVisible }
}
