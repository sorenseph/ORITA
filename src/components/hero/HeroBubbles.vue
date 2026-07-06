<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const bubbles = ref(
  Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 40 + 10,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 3,
  }))
)

onMounted(() => {
  gsap.from('.hero-bubble', {
    scale: 0,
    opacity: 0,
    duration: 1,
    stagger: 0.05,
    delay: 1,
    ease: 'back.out(1.7)',
  })
})
</script>

<template>
  <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <div
      v-for="b in bubbles"
      :key="b.id"
      class="hero-bubble absolute rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
      :style="{
        width: `${b.size}px`,
        height: `${b.size}px`,
        left: `${b.left}%`,
        bottom: '-5%',
        animation: `rise ${b.duration}s ease-in-out ${b.delay}s infinite`,
      }"
    />
  </div>
</template>

<style scoped>
@keyframes rise {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.6;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(-110vh) scale(0.5);
    opacity: 0;
  }
}
</style>
