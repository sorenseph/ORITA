<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  direction: { type: String, default: 'left' },
  duration: { type: Number, default: 35 },
})

const loopItems = computed(() => [...props.items, ...props.items])
</script>

<template>
  <div class="marquee-mask overflow-hidden">
    <div
      class="marquee-track flex w-max gap-4 md:gap-5"
      :class="direction === 'right' ? 'animate-marquee-right' : 'animate-marquee-left'"
      :style="{ '--marquee-duration': `${duration}s` }"
    >
      <template v-for="(item, i) in loopItems" :key="`${item.id ?? i}-${i}`">
        <slot :item="item" :index="i" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.marquee-mask {
  mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
}

.marquee-track {
  animation-duration: var(--marquee-duration);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform;
}

.animate-marquee-left {
  animation-name: marquee-left;
}

.animate-marquee-right {
  animation-name: marquee-right;
}

@keyframes marquee-left {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes marquee-right {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}
</style>
