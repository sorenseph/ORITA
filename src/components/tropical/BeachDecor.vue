<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'hero' },
  light: { type: Boolean, default: false },
  minimal: { type: Boolean, default: false },
})

const dropCount = computed(() => (props.minimal ? 3 : 6))
</script>

<template>
  <div class="decor-layer" aria-hidden="true">
    <div
      class="absolute rounded-full"
      :class="minimal ? '-right-8 -top-8 h-28 w-28 md:h-56 md:w-56' : '-right-12 -top-12 h-40 w-40 md:h-56 md:w-56'"
      :style="{
        background: light
          ? 'radial-gradient(circle, rgba(255,200,100,0.2) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(255,248,224,0.3) 0%, transparent 70%)',
      }"
    />

    <span
      v-for="n in dropCount"
      :key="n"
      class="splash-drop absolute rounded-full"
      :class="light ? 'bg-[#4AAB9E]/12' : 'bg-white/15'"
      :style="{
        width: `${4 + n * 2}px`,
        height: `${4 + n * 2}px`,
        top: `${14 + (n * 14) % 50}%`,
        left: `${8 + (n * 18) % 75}%`,
        animationDelay: `${n * 0.7}s`,
      }"
    />
  </div>
</template>

<style scoped>
.splash-drop {
  animation: splashDrop 5s ease-in-out infinite;
}

@keyframes splashDrop {
  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.15;
  }
  50% {
    transform: translateY(-10px) scale(1.1);
    opacity: 0.35;
  }
}
</style>
