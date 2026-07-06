<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useWindowSize } from '@vueuse/core'
import { useThemeStore } from '../../stores/theme'
import { getAtmosphere } from '../../data/atmosphere'
import { useMouseDepth } from '../../composables/useMouseDepth'
import { AGAVE_IMG, AGAVE_WALLPAPER } from '../../data/agaveAssets'

const { activeFlavor } = storeToRefs(useThemeStore())
const { width } = useWindowSize()
const { mx, my } = useMouseDepth()

const isMobile = computed(() => width.value < 768)
const atmo = computed(() => getAtmosphere(activeFlavor.value.id))

const layers = [
  {
    src: AGAVE_WALLPAPER,
    class: 'bottom-0 left-1/2 h-[38%] w-[130%] -translate-x-1/2 object-cover object-bottom',
    depth: 0.04,
    blur: 8,
    wallpaper: true,
  },
  {
    src: AGAVE_IMG,
    class: 'bottom-0 left-[-12%] h-[55%] object-bottom',
    depth: 0.12,
    blur: 14,
  },
  {
    src: AGAVE_IMG,
    class: 'bottom-0 right-[-10%] h-[50%] -scale-x-100 object-bottom',
    depth: 0.18,
    blur: 18,
  },
]

function layerStyle(layer) {
  const parallaxX = mx.value * layer.depth * 12
  return {
    filter: layer.blur ? `blur(${layer.blur}px)` : undefined,
    opacity: layer.wallpaper ? atmo.value.agaveWallOpacity : atmo.value.agaveOpacity,
    transform: layer.wallpaper
      ? `translateX(calc(-50% + ${parallaxX}px))`
      : `translate3d(${parallaxX}px, 0, 0)`,
  }
}
</script>

<template>
  <div
    v-if="!isMobile"
    class="atmosphere-agave pointer-events-none absolute inset-0 overflow-hidden"
    aria-hidden="true"
  >
    <img
      v-for="(layer, i) in layers"
      :key="i"
      :src="layer.src"
      alt=""
      class="absolute w-auto max-w-none"
      :class="layer.class"
      :style="layerStyle(layer)"
      loading="lazy"
    />
  </div>
</template>
