<script setup>
import { computed } from 'vue'

const props = defineProps({
  scrollProgress: { type: Number, default: 0 },
  light: { type: Boolean, default: false },
  compact: { type: Boolean, default: false },
})

const foliage = [
  { src: '/recursos/hojas/hoja1.png', class: 'left-[-6%] bottom-[16%] h-32 md:h-48', rotate: -12, parallax: 18 },
  { src: '/recursos/hojas/hoja2.png', class: 'right-[-4%] bottom-[20%] h-28 md:h-40', rotate: 15, parallax: 14 },
  { src: '/recursos/hojas/hoja3.png', class: 'right-[4%] top-[10%] h-24 md:h-36', rotate: 22, parallax: 26 },
  { src: '/recursos/hojas/hoja4.png', class: 'left-[6%] top-[14%] h-20 md:h-28', rotate: -18, parallax: 22 },
  { src: '/svg/agave.svg', class: 'right-[8%] bottom-[28%] h-28 md:h-40', rotate: 6, parallax: 12 },
  { src: '/recursos/limones/2hojalimon.png', class: 'right-[2%] top-[24%] h-14 md:h-20', rotate: -10, parallax: 20 },
]

const visible = computed(() =>
  props.compact ? foliage.filter((_, i) => [0, 2, 4].includes(i)) : foliage,
)
</script>

<template>
  <div class="decor-layer" aria-hidden="true">
    <img
      v-for="(leaf, i) in visible"
      :key="i"
      :src="leaf.src"
      alt=""
      class="foliage-item absolute w-auto max-w-none object-contain"
      :class="[leaf.class, light ? 'opacity-[0.12]' : compact ? 'opacity-[0.18] md:opacity-[0.28]' : 'opacity-[0.22] md:opacity-[0.3]']"
      :style="{
        transform: `translate3d(0, ${-scrollProgress * leaf.parallax}px, 0) rotate(${leaf.rotate}deg)`,
        animationDelay: `${i * 0.35}s`,
      }"
      loading="lazy"
    />
  </div>
</template>

<style scoped>
.foliage-item {
  animation: foliageSway 8s ease-in-out infinite;
}

@keyframes foliageSway {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -8px; }
}
</style>
