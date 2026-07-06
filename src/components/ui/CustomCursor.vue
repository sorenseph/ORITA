<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCustomCursor } from '../../composables/useCustomCursor'

const outerRef = ref(null)
const innerRef = ref(null)
const { x, y, mode, flavorEmoji, visible, active, init, update, destroy } = useCustomCursor()

let raf = null

function loop() {
  update()
  raf = requestAnimationFrame(loop)
}

onMounted(() => {
  if (!active.value) return
  init(outerRef.value, innerRef.value)
  raf = requestAnimationFrame(loop)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  destroy()
})
</script>

<template>
  <div v-if="active && visible" class="custom-cursor" aria-hidden="true">
    <div
      ref="outerRef"
      class="cursor-outer fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 mix-blend-difference"
      :class="[
        mode === 'liquid' ? 'cursor-outer--liquid' : '',
        mode === 'flavor' ? 'cursor-outer--flavor' : '',
      ]"
    >
      <span v-if="mode === 'flavor'" class="cursor-emoji">{{ flavorEmoji }}</span>
    </div>
    <div
      ref="innerRef"
      class="cursor-inner fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 mix-blend-difference"
    />
  </div>
</template>

<style scoped>
.cursor-outer {
  width: 36px;
  height: 36px;
  transition: width 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    height 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.45s ease;
}

.cursor-outer--liquid {
  width: 52px;
  height: 52px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(6px);
  border-radius: 45% 55% 50% 50%;
  animation: cursorMorph 4s ease-in-out infinite;
}

.cursor-outer--flavor {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.15);
  border: none;
}

.cursor-emoji {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 1.25rem;
  mix-blend-mode: normal;
  filter: none;
}

.cursor-inner {
  width: 6px;
  height: 6px;
  pointer-events: none;
}

@keyframes cursorMorph {
  0%, 100% { border-radius: 45% 55% 50% 50%; }
  33% { border-radius: 55% 45% 52% 48%; }
  66% { border-radius: 48% 52% 45% 55%; }
}
</style>
