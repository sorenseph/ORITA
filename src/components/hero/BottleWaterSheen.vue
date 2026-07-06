<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'
import gsap from 'gsap'

const reduced = usePreferredReducedMotion()
const sheenRef = ref(null)
const turbRef = ref(null)
let tween

onMounted(() => {
  if (reduced.value || !turbRef.value) return

  tween = gsap.to(turbRef.value, {
    attr: { baseFrequency: 0.018 },
    duration: 6,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })

  if (sheenRef.value) {
    gsap.to(sheenRef.value, {
      x: '120%',
      duration: 5.5,
      repeat: -1,
      ease: 'none',
    })
  }
})

onUnmounted(() => {
  tween?.kill()
})
</script>

<template>
  <div class="bottle-water-sheen pointer-events-none absolute inset-0 z-[11] overflow-hidden" aria-hidden="true">
    <svg class="absolute h-0 w-0" aria-hidden="true">
      <filter id="orita-water-displace" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence
          ref="turbRef"
          type="fractalNoise"
          baseFrequency="0.012"
          numOctaves="2"
          seed="4"
          result="noise"
        />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>

    <div
      ref="sheenRef"
      class="bottle-water-sheen__band absolute -left-full top-[18%] h-[45%] w-[40%] -skew-x-12 opacity-50"
      style="background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.35) 45%, transparent 100%)"
    />
  </div>
</template>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  .bottle-water-sheen__band {
    display: none;
  }
}
</style>
