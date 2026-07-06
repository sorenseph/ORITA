<script setup>
defineProps({
  scrollProgress: { type: Number, default: 0 },
  light: { type: Boolean, default: false },
})

const foliage = [
  { src: '/recursos/hojas/hoja1.png', class: 'left-[-6%] bottom-[16%] h-32 md:h-48', rotate: -12, parallax: 18 },
  { src: '/recursos/hojas/hoja2.png', class: 'right-[-4%] bottom-[20%] h-28 md:h-40', rotate: 15, parallax: 14 },
  { src: '/recursos/hojas/hoja3.png', class: 'right-[4%] top-[10%] h-24 md:h-36', rotate: 22, parallax: 26 },
  { src: '/recursos/hojas/hoja4.png', class: 'left-[6%] top-[14%] h-20 md:h-28', rotate: -18, parallax: 22 },
  { src: '/recursos/hojas/hoja5.png', class: 'left-[12%] bottom-[34%] h-16 md:h-24', rotate: -8, parallax: 16 },
  { src: '/svg/agave.svg', class: 'right-[8%] bottom-[28%] h-28 md:h-40', rotate: 6, parallax: 12 },
  { src: '/svg/palm.svg', class: 'left-[2%] bottom-[8%] h-24 md:h-32 opacity-80', rotate: -5, parallax: 10 },
  { src: '/recursos/limones/2hojalimon.png', class: 'right-[2%] top-[24%] h-14 md:h-20', rotate: -10, parallax: 20 },
]
</script>

<template>
  <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <img
      v-for="(leaf, i) in foliage"
      :key="i"
      :src="leaf.src"
      alt=""
      class="foliage-item absolute w-auto max-w-none object-contain"
      :class="[leaf.class, light ? 'opacity-[0.14]' : 'opacity-[0.26] md:opacity-[0.32]']"
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
  animation: foliageSway 7s ease-in-out infinite;
  will-change: transform;
}

@keyframes foliageSway {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -10px; }
}
</style>
