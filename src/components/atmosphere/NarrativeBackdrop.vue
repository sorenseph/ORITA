<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap, ScrollTrigger } from '../../composables/useLenis'

const rootRef = ref(null)
const seaRef = ref(null)
const sandRef = ref(null)
const greenRef = ref(null)
const noiseRef = ref(null)

let ctx

onMounted(() => {
  const main = document.querySelector('.narrative-body')
  if (!main || !rootRef.value) return

  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: main,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.4,
      },
    })

    tl.fromTo(seaRef.value, { opacity: 1 }, { opacity: 0, ease: 'none' }, 0)
      .fromTo(sandRef.value, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0.15)
      .to(sandRef.value, { opacity: 0, ease: 'none' }, 0.55)
      .fromTo(greenRef.value, { opacity: 0 }, { opacity: 0.85, ease: 'none' }, 0.45)

    gsap.to(noiseRef.value, {
      backgroundPosition: '120px 80px',
      ease: 'none',
      scrollTrigger: {
        trigger: main,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
      },
    })

    gsap.to(rootRef.value.querySelector('.narrative-aurora'), {
      rotation: 12,
      scale: 1.12,
      ease: 'none',
      scrollTrigger: {
        trigger: main,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 3,
      },
    })
  }, rootRef)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <div ref="rootRef" class="narrative-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <div
      ref="seaRef"
      class="narrative-backdrop__layer absolute inset-0"
      style="background: radial-gradient(ellipse 90% 70% at 50% 20%, #3bbfa3 0%, #1a5c54 45%, #0f3d38 100%)"
    />
    <div
      ref="sandRef"
      class="narrative-backdrop__layer absolute inset-0 opacity-0"
      style="background: radial-gradient(ellipse 100% 80% at 40% 60%, #fff8f0 0%, #f7f0e3 40%, #e8dcc8 100%)"
    />
    <div
      ref="greenRef"
      class="narrative-backdrop__layer absolute inset-0 opacity-0"
      style="background: radial-gradient(ellipse 110% 90% at 50% 100%, #2a7a72 0%, #1a3c38 55%, #0f2824 100%)"
    />
    <div
      class="narrative-aurora absolute -left-[20%] top-[10%] h-[70vh] w-[70vw] rounded-full opacity-30 blur-[100px]"
      style="background: conic-gradient(from 120deg, #4aab9e, #d4734a, #e8c84a, #3bbfa3, #4aab9e)"
    />
    <div
      ref="noiseRef"
      class="absolute inset-0 opacity-[0.04]"
      style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E'); background-size: 180px 180px"
    />
  </div>
</template>

<style scoped>
.narrative-backdrop__layer {
  will-change: opacity;
}
</style>
