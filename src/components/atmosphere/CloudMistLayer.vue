<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '../../stores/theme'
import { getAtmosphere } from '../../data/atmosphere'
import { useMouseDepth } from '../../composables/useMouseDepth'

const { activeFlavor } = storeToRefs(useThemeStore())
const { mx, my } = useMouseDepth()

const atmo = computed(() => getAtmosphere(activeFlavor.value.id))

const clouds = [
  { w: '38%', top: '8%', left: '-5%', dur: 38, delay: 0, depth: 0.3 },
  { w: '28%', top: '18%', right: '-3%', dur: 44, delay: 4, depth: 0.5 },
  { w: '45%', top: '4%', left: '30%', dur: 52, delay: 2, depth: 0.2 },
  { w: '22%', top: '28%', left: '12%', dur: 36, delay: 8, depth: 0.7 },
]

function cloudStyle(c, i) {
  return {
    width: c.w,
    top: c.top,
    left: c.left,
    right: c.right,
    background: atmo.value.cloud,
    animationDuration: `${c.dur}s`,
    animationDelay: `${c.delay}s`,
    transform: `translate3d(${mx.value * c.depth * 12}px, ${my.value * c.depth * 8}px, 0)`,
    opacity: 0.35 + (i % 2) * 0.15,
  }
}
</script>

<template>
  <div class="atmosphere-clouds pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <div
      v-for="(c, i) in clouds"
      :key="i"
      class="cloud-drift absolute h-16 rounded-full blur-2xl md:h-24"
      :style="cloudStyle(c, i)"
    />
    <div
      class="mist-layer absolute inset-0"
      :style="{
        background: `radial-gradient(ellipse 90% 60% at 50% 100%, ${atmo.mist}, transparent 70%)`,
        transform: `translate3d(${mx.value * 6}px, ${my.value * 4}px, 0)`,
      }"
    />
    <div
      class="light-ray absolute -top-[20%] left-[20%] h-[80%] w-[30%] rotate-12 opacity-20 blur-3xl md:opacity-30"
      :style="{ background: atmo.lightColor }"
    />
  </div>
</template>

<style scoped>
.cloud-drift {
  animation: cloudDrift linear infinite;
}

.light-ray {
  animation: rayPulse 12s ease-in-out infinite;
}

@keyframes cloudDrift {
  0%, 100% { translate: 0 0; }
  50% { translate: 24px -8px; }
}

@keyframes rayPulse {
  0%, 100% { opacity: 0.15; transform: rotate(12deg) scale(1); }
  50% { opacity: 0.35; transform: rotate(14deg) scale(1.08); }
}

.mist-layer {
  animation: mistBreath 10s ease-in-out infinite;
}

@keyframes mistBreath {
  0%, 100% { opacity: 0.85; }
  50% { opacity: 1; }
}
</style>
