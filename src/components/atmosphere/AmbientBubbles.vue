<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWindowSize, usePreferredReducedMotion } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '../../stores/theme'
import { getAtmosphere } from '../../data/atmosphere'

const props = defineProps({
  tint: { type: String, default: null },
  count: { type: Number, default: null },
})

const theme = useThemeStore()
const { activeFlavor } = storeToRefs(theme)
const { width } = useWindowSize()
const reduced = usePreferredReducedMotion()

const isMobile = computed(() => width.value < 768)
const bubbleTint = computed(() => props.tint || getAtmosphere(activeFlavor.value.id).bubbleTint)

const bubbles = ref([])

function generate() {
  const n = props.count ?? (isMobile.value ? 12 : 24)
  bubbles.value = Array.from({ length: n }, (_, i) => ({
    id: i,
    size: Math.random() * 36 + 8,
    left: Math.random() * 100,
    delay: Math.random() * 12,
    duration: Math.random() * 8 + 10,
    drift: (Math.random() - 0.5) * 40,
  }))
}

onMounted(generate)
</script>

<template>
  <div
    v-if="!reduced"
    class="atmosphere-bubbles pointer-events-none absolute inset-0 overflow-hidden"
    aria-hidden="true"
  >
    <div
      v-for="b in bubbles"
      :key="b.id"
      class="ambient-bubble absolute rounded-full border border-white/15"
      :style="{
        width: `${b.size}px`,
        height: `${b.size}px`,
        left: `${b.left}%`,
        bottom: '-8%',
        background: bubbleTint,
        boxShadow: `0 0 ${b.size * 0.4}px ${bubbleTint}`,
        animation: `bubbleRise ${b.duration}s ease-in-out ${b.delay}s infinite`,
        '--drift': `${b.drift}px`,
      }"
    />
  </div>
</template>

<style scoped>
@keyframes bubbleRise {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 0;
  }
  8% {
    opacity: 0.55;
  }
  50% {
    transform: translate3d(calc(var(--drift) * 0.5), -55vh, 0) scale(1.05);
    opacity: 0.35;
  }
  100% {
    transform: translate3d(var(--drift), -115vh, 0) scale(0.6);
    opacity: 0;
  }
}

.ambient-bubble {
  backdrop-filter: blur(2px);
}
</style>
