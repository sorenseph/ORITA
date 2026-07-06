<script setup>
import { computed } from 'vue'
import { useMouse } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '../../stores/theme'

defineProps({
  scrollProgress: { type: Number, default: 0 },
})

const { activeFlavor } = storeToRefs(useThemeStore())
const { x: mouseX, y: mouseY } = useMouse()

const collage = computed(() => activeFlavor.value.collage || [])

function collageStyle(item, i) {
  const cx = typeof window !== 'undefined' ? window.innerWidth / 2 : 0
  const cy = typeof window !== 'undefined' ? window.innerHeight / 2 : 0
  const dx = (mouseX.value - cx) / cx
  const dy = (mouseY.value - cy) / cy
  const factor = 10 + i * 4
  return {
    top: item.top,
    bottom: item.bottom,
    left: item.left,
    right: item.right,
    width: `${item.w}px`,
    transform: `${item.centerX ? 'translateX(-50%)' : ''} rotate(${item.rotate + dx * 8}deg) translate(${dx * factor}px, ${dy * factor}px)`,
    animationDelay: `${item.delay}s`,
  }
}
</script>

<template>
  <Transition name="collage-wrap">
    <div :key="activeFlavor.id" class="pointer-events-none absolute inset-0 z-[4] overflow-hidden" aria-hidden="true">
      <img
        v-for="(item, i) in collage"
        :key="`${activeFlavor.id}-${i}`"
        :src="item.img"
        alt=""
        class="collage-orbit absolute max-w-none object-contain drop-shadow-[0_16px_40px_rgba(0,0,0,0.2)]"
        :style="collageStyle(item, i)"
        loading="lazy"
      />
    </div>
  </Transition>
</template>

<style scoped>
.collage-orbit { animation: orbitFloat 5s ease-in-out infinite; }
.collage-wrap-enter-active, .collage-wrap-leave-active { transition: opacity 0.45s ease; }
.collage-wrap-enter-from, .collage-wrap-leave-to { opacity: 0; }
@keyframes orbitFloat {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -14px; }
}
</style>
