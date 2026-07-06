<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useMouse, useWindowSize } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '../../stores/theme'
import { useOrganicMotion } from '../../composables/useOrganicMotion'
import gsap from 'gsap'

defineProps({
  scrollProgress: { type: Number, default: 0 },
})

const { activeFlavor } = storeToRefs(useThemeStore())
const { x: mouseX, y: mouseY } = useMouse()
const { width } = useWindowSize()
const { sway, slowSpin, killAll } = useOrganicMotion()

const itemRefs = ref([])
const isMobile = computed(() => width.value < 768)

const collage = computed(() => {
  const items = activeFlavor.value.collage || []
  return isMobile.value ? items.slice(0, 2) : items
})

function collageStyle(item, i) {
  const mobile = isMobile.value
  const scale = mobile ? 0.58 : 1
  const cx = width.value / 2
  const cy = typeof window !== 'undefined' ? window.innerHeight / 2 : 0
  const dx = mobile ? 0 : (mouseX.value - cx) / cx
  const dy = mobile ? 0 : (mouseY.value - cy) / cy
  const factor = mobile ? 0 : 14 + i * 5
  return {
    top: item.top,
    bottom: item.bottom,
    left: item.left,
    right: item.right,
    width: `${Math.round(item.w * scale)}px`,
    transform: `${item.centerX ? 'translateX(-50%)' : ''} rotate(${item.rotate + dx * 10}deg) translate(${dx * factor}px, ${dy * factor}px)`,
    opacity: mobile ? 0.5 : 1,
  }
}

function setItemRef(el) {
  if (el) itemRefs.value.push(el)
}

function animateItems() {
  killAll()
  itemRefs.value = []
}

onMounted(animateItems)
onUnmounted(killAll)

watch(activeFlavor, () => {
  itemRefs.value = []
  animateItems()
})

watch(isMobile, animateItems)
</script>

<template>
  <Transition name="collage-wrap">
    <div
      :key="activeFlavor.id"
      class="collage-layer decor-layer overflow-hidden"
      style="z-index: 7"
      aria-hidden="true"
    >
      <img
        v-for="(item, i) in collage"
        :key="`${activeFlavor.id}-${i}`"
        :ref="setItemRef"
        :src="item.img"
        alt=""
        class="collage-orbit absolute max-w-none object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
        :style="collageStyle(item, i)"
        loading="lazy"
      />
    </div>
  </Transition>
</template>

<style scoped>
@media (max-width: 767px) {
  .collage-layer {
    mask-image: linear-gradient(to bottom, black 0%, black 50%, transparent 78%);
  }
}

.collage-wrap-enter-active,
.collage-wrap-leave-active {
  transition: opacity 0.8s ease, filter 0.8s ease;
}

.collage-wrap-enter-from,
.collage-wrap-leave-to {
  opacity: 0;
  filter: blur(6px);
}
</style>
