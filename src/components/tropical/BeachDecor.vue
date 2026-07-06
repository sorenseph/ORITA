<script setup>
import { computed } from 'vue'
import { useMouseDepth } from '../../composables/useMouseDepth'

const props = defineProps({
  variant: { type: String, default: 'hero' },
  light: { type: Boolean, default: false },
  minimal: { type: Boolean, default: false },
})

const { mx, my } = useMouseDepth()
const dropCount = computed(() => (props.minimal ? 5 : 8))

const sunStyle = computed(() => ({
  background: props.light
    ? 'radial-gradient(circle, rgba(255,200,100,0.22) 0%, transparent 70%)'
    : 'radial-gradient(circle, rgba(255,248,224,0.35) 0%, transparent 70%)',
  transform: `translate3d(${mx.value * 12}px, ${my.value * 8}px, 0)`,
}))
</script>

<template>
  <div class="decor-layer" aria-hidden="true">
    <div
      class="sun-glow absolute rounded-full life-glow"
      :class="minimal ? '-right-8 -top-8 h-28 w-28 md:h-56 md:w-56' : '-right-12 -top-12 h-40 w-40 md:h-56 md:w-56'"
      :style="sunStyle"
    />

    <span
      v-for="n in dropCount"
      :key="n"
      class="splash-drop absolute rounded-full life-float"
      :class="light ? 'bg-[#4AAB9E]/12' : 'bg-white/15'"
      :style="{
        width: `${4 + n * 2}px`,
        height: `${4 + n * 2}px`,
        top: `${14 + (n * 14) % 50}%`,
        left: `${8 + (n * 18) % 75}%`,
        animationDelay: `${n * 0.7}s`,
        transform: `translate3d(${mx.value * (n % 3) * 4}px, ${my.value * (n % 2) * 3}px, 0)`,
      }"
    />
  </div>
</template>

<style scoped>
.sun-glow {
  animation: sunPulse 10s ease-in-out infinite;
}

.splash-drop {
  animation: splashDrop 5s ease-in-out infinite;
}

@keyframes sunPulse {
  0%, 100% { opacity: 0.85; scale: 1; }
  50% { opacity: 1; scale: 1.06; }
}

@keyframes splashDrop {
  0%, 100% {
    translate: 0 0;
    opacity: 0.15;
  }
  50% {
    translate: 0 -12px;
    opacity: 0.38;
  }
}
</style>
