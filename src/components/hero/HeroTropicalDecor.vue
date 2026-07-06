<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '../../stores/theme'

const theme = useThemeStore()
const { activeFlavor } = storeToRefs(theme)

const items = computed(() =>
  (activeFlavor.value.decor || []).map((img, i) => ({
    img,
    style: {
      left: i === 0 ? '8%' : 'auto',
      right: i === 1 ? '8%' : 'auto',
      top: `${20 + i * 15}%`,
      animationDelay: `${i * 1.2}s`,
      animationDuration: `${5 + i}s`,
    },
  }))
)
</script>

<template>
  <div class="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden="true">
    <img
      v-for="(item, i) in items"
      :key="`${activeFlavor.id}-${i}`"
      :src="item.img"
      alt=""
      class="tropical-drift absolute h-16 w-16 object-contain opacity-20 md:h-24 md:w-24 md:opacity-25"
      :style="item.style"
      loading="lazy"
    />
  </div>
</template>

<style scoped>
.tropical-drift {
  animation: tropicalDrift ease-in-out infinite;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.3));
}

@keyframes tropicalDrift {
  0%,
  100% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-24px) rotate(8deg);
  }
}
</style>
