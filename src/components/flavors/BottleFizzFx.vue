<script setup>
import { computed } from 'vue'

const props = defineProps({
  tint: { type: String, default: 'rgba(255, 255, 255, 0.55)' },
  count: { type: Number, default: 12 },
  active: { type: Boolean, default: true },
})

const bubbles = computed(() =>
  Array.from({ length: props.count }, (_, i) => ({
    id: i,
    left: 20 + ((i * 23) % 60),
    size: 6 + (i % 4) * 3,
    duration: 1.6 + (i % 5) * 0.2,
    delay: i * 0.11,
    drift: ((i % 6) - 2.5) * 16,
    rise: -(100 + (i % 6) * 28),
  })),
)
</script>

<template>
  <div v-if="active" class="bottle-fizz pointer-events-none absolute inset-0 z-[5] overflow-visible" aria-hidden="true">
    <span
      v-for="b in bubbles"
      :key="b.id"
      class="bottle-fizz__bubble absolute rounded-full"
      :style="{
        left: `${b.left}%`,
        bottom: '16%',
        width: `${b.size}px`,
        height: `${b.size}px`,
        background: `radial-gradient(circle at 28% 28%, rgba(255,255,255,0.95), ${tint})`,
        boxShadow: `0 0 ${Math.round(b.size * 1.4)}px ${tint}`,
        '--drift': `${b.drift}px`,
        '--rise': `${b.rise}px`,
        '--dur': `${b.duration}s`,
        '--delay': `${b.delay}s`,
      }"
    />
    <span
      v-for="b in bubbles.slice(0, 3)"
      :key="`ring-${b.id}`"
      class="bottle-fizz__ring absolute left-1/2 top-[38%] rounded-full border-2 border-white/30"
      :style="{
        width: `${130 + b.id * 40}px`,
        height: `${130 + b.id * 40}px`,
        marginLeft: `${-(65 + b.id * 20)}px`,
        marginTop: `${-(65 + b.id * 20)}px`,
        '--ring-dur': `${2.4 + b.id * 0.35}s`,
        '--ring-delay': `${b.id * 0.5}s`,
      }"
    />
  </div>
</template>

<style scoped>
.bottle-fizz__bubble {
  opacity: 0;
  transform: translate3d(-50%, 0, 0);
  animation: bottleFizzPop var(--dur) ease-out var(--delay) infinite;
}

.bottle-fizz__ring {
  opacity: 0;
  animation: bottleFizzRing var(--ring-dur) ease-out var(--ring-delay) infinite;
}

@keyframes bottleFizzPop {
  0% {
    transform: translate3d(-50%, 0, 0) scale(0.4);
    opacity: 0;
  }
  20% {
    opacity: 0.92;
  }
  100% {
    transform: translate3d(calc(-50% + var(--drift)), var(--rise), 0) scale(0.2);
    opacity: 0;
  }
}

@keyframes bottleFizzRing {
  0% {
    transform: scale(0.7);
    opacity: 0.4;
  }
  100% {
    transform: scale(1.05);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bottle-fizz__bubble,
  .bottle-fizz__ring {
    display: none;
  }
}
</style>
