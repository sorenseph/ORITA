<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useOrganicMotion } from '../../composables/useOrganicMotion'
import { useMouseDepth } from '../../composables/useMouseDepth'

const leaves = [
  { src: '/recursos/hojas/hoja1.png', class: 'left-[3%] top-[6%] h-12 -rotate-12 md:h-16', delay: 0, depth: 0.8 },
  { src: '/recursos/hojas/hoja2.png', class: 'right-[5%] top-[10%] h-10 rotate-[18deg] md:h-14', delay: 0.4, depth: 1 },
  { src: '/recursos/hojas/hoja3.png', class: 'left-[8%] bottom-[14%] h-11 rotate-[6deg] md:h-14', delay: 0.8, depth: 0.9 },
  { src: '/recursos/hojas/hoja4.png', class: 'right-[6%] bottom-[18%] h-10 -rotate-[10deg] md:h-12', delay: 1.1, depth: 1.1 },
  { src: '/recursos/hojas/hoja5.png', class: 'left-[42%] top-[4%] h-9 rotate-[4deg] opacity-30 md:h-11', delay: 0.6, depth: 0.7 },
]

const leafRefs = ref([])
const { sway, killAll } = useOrganicMotion()
const { mx, my } = useMouseDepth()

function leafStyle(leaf) {
  return {
    transform: `translate3d(${mx.value * leaf.depth * 10}px, ${my.value * leaf.depth * 7}px, 0)`,
    animationDelay: `${leaf.delay}s`,
  }
}

function setLeafRef(el) {
  if (el) leafRefs.value.push(el)
}

onMounted(() => {})

onUnmounted(killAll)
</script>

<template>
  <div class="decor-layer" aria-hidden="true">
    <img
      v-for="(leaf, i) in leaves"
      :key="i"
      :ref="setLeafRef"
      :src="leaf.src"
      alt=""
      class="leaf-drift absolute w-auto max-w-none object-contain opacity-[0.38] md:opacity-[0.45]"
      :class="leaf.class"
      :style="leafStyle(leaf)"
      loading="lazy"
    />
  </div>
</template>

<style scoped>
.leaf-drift {
  will-change: transform;
}
</style>
