<script setup>
defineProps({
  tint: { type: String, default: 'rgba(255,255,255,0.55)' },
})
</script>

<template>
  <div class="hero-condensation pointer-events-none absolute inset-0 z-[15] overflow-hidden" aria-hidden="true">
    <span
      v-for="i in 6"
      :key="i"
      class="hero-condensation__drop absolute rounded-full"
      :style="{
        left: `${18 + i * 11}%`,
        top: `${22 + (i % 3) * 8}%`,
        width: `${3 + (i % 2)}px`,
        height: `${5 + (i % 3)}px`,
        background: tint,
        '--dur': `${3.2 + i * 0.4}s`,
        '--delay': `${i * 0.35}s`,
      }"
    />
  </div>
</template>

<style scoped>
.hero-condensation__drop {
  opacity: 0;
  animation: condenseDrop var(--dur) ease-in-out var(--delay) infinite;
}

@keyframes condenseDrop {
  0%, 100% { opacity: 0; transform: translateY(0) scaleY(1); }
  15% { opacity: 0.7; }
  70% { opacity: 0.35; transform: translateY(28px) scaleY(1.4); }
  100% { opacity: 0; transform: translateY(42px) scaleY(0.6); }
}

@media (prefers-reduced-motion: reduce) {
  .hero-condensation__drop { display: none; }
}
</style>
