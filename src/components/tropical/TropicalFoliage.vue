<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useOrganicMotion } from '../../composables/useOrganicMotion'
import { useMouseDepth } from '../../composables/useMouseDepth'

const props = defineProps({
  scrollProgress: { type: Number, default: 0 },
  light: { type: Boolean, default: false },
  compact: { type: Boolean, default: false },
  layered: { type: Boolean, default: false },
})

const { sway, killAll } = useOrganicMotion()
const { mx, my } = useMouseDepth()
const leafRefs = ref([])

const foliage = [
  { src: '/recursos/hojas/hoja1.png', class: 'left-[-6%] bottom-[16%] h-32 md:h-48', rotate: -12, parallax: 18, depth: 0.8 },
  { src: '/recursos/hojas/hoja2.png', class: 'right-[-4%] bottom-[20%] h-28 md:h-40', rotate: 15, parallax: 14, depth: 1 },
  { src: '/recursos/hojas/hoja3.png', class: 'right-[4%] top-[10%] h-24 md:h-36', rotate: 22, parallax: 26, depth: 1.2 },
  { src: '/recursos/hojas/hoja4.png', class: 'left-[6%] top-[14%] h-20 md:h-28', rotate: -18, parallax: 22, depth: 0.9 },
  { src: '/svg/agave.svg', class: 'right-[8%] bottom-[28%] h-28 md:h-40', rotate: 6, parallax: 12, depth: 0.7 },
  { src: '/recursos/limones/2hojalimon.png', class: 'right-[2%] top-[24%] h-14 md:h-20', rotate: -10, parallax: 20, depth: 1.1 },
]

const visible = computed(() =>
  props.compact ? foliage.filter((_, i) => [0, 2, 4].includes(i)) : foliage,
)

function leafStyle(leaf) {
  const scrollY = -props.scrollProgress * leaf.parallax
  const mouseX = mx.value * leaf.depth * 14
  const mouseY = my.value * leaf.depth * 10
  return {
    transform: `translate3d(${mouseX}px, ${scrollY + mouseY}px, 0) rotate(${leaf.rotate}deg)`,
  }
}

function setLeafRef(el) {
  if (el) leafRefs.value.push(el)
}

function animateLeaves() {
  killAll()
  leafRefs.value = []
}

onMounted(animateLeaves)
onUnmounted(killAll)
watch(visible, animateLeaves)
</script>

<template>
  <div class="decor-layer foliage-layer" :class="layered ? 'foliage-layer--deep' : ''" aria-hidden="true">
    <img
      v-for="(leaf, i) in visible"
      :key="i"
      :ref="setLeafRef"
      :src="leaf.src"
      alt=""
      class="foliage-item absolute w-auto max-w-none object-contain"
      :class="[leaf.class, light ? 'opacity-[0.12]' : compact ? 'opacity-[0.2] md:opacity-[0.32]' : 'opacity-[0.24] md:opacity-[0.36]']"
      :style="leafStyle(leaf)"
      loading="lazy"
    />
  </div>
</template>

<style scoped>
.foliage-layer--deep {
  z-index: 6;
}

.foliage-item {
  will-change: transform;
}
</style>
