<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from '../../composables/useLenis'
import { FLUID_MORPH_PATHS } from '../../data/fluidMorphPaths'

const props = defineProps({
  colors: {
    type: Array,
    default: () => ['#4AAB9E', '#5ec4b8', '#3d9a8e', '#2A7A72', '#6ed4c4', '#248f82', '#1a5c56'],
  },
  backgroundColor: { type: String, default: 'transparent' },
  duration: { type: Number, default: 4 },
  pathCount: { type: Number, default: 5 },
  blend: { type: String, default: 'soft-light' },
  opacity: { type: Number, default: 1 },
})

const containerRef = ref(null)
let ctx

onMounted(() => {
  if (!containerRef.value) return
  const paths = containerRef.value.querySelectorAll('path')
  const count = Math.min(props.pathCount, paths.length, FLUID_MORPH_PATHS.length)

  ctx = gsap.context(() => {
    for (let i = 0; i < count; i++) {
      const path = paths[i]
      const [from, to] = FLUID_MORPH_PATHS[i]
      const variance = (i % 3) * 0.5
      const delay = (i % 4) * 0.2
      gsap.fromTo(
        path,
        { attr: { d: from } },
        {
          attr: { d: to },
          duration: props.duration + variance,
          delay,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        },
      )
    }
  }, containerRef)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <div
    ref="containerRef"
    class="pointer-events-none absolute inset-0 overflow-hidden"
    :style="{ backgroundColor, mixBlendMode: blend, opacity }"
    aria-hidden="true"
  >
    <svg
      class="absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 1440 800"
    >
      <path
        v-for="(_, index) in pathCount"
        :key="index"
        :d="FLUID_MORPH_PATHS[index][0]"
        :fill="colors[index % colors.length]"
        :opacity="0.55 + (index % 3) * 0.12"
      />
    </svg>
  </div>
</template>
