<script setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import LiquidShaderBg from './LiquidShaderBg.vue'
import AgaveSilhouettes from './AgaveSilhouettes.vue'
import CloudMistLayer from './CloudMistLayer.vue'
import AmbientParticles from './AmbientParticles.vue'
import AmbientBubbles from './AmbientBubbles.vue'

defineProps({
  scrollProgress: { type: Number, default: 0 },
})

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
</script>

<template>
  <div class="atmosphere-stack pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <LiquidShaderBg />
    <AgaveSilhouettes />
    <CloudMistLayer v-if="!isMobile" />
    <AmbientParticles :density="isMobile ? 0.45 : 0.85" />
    <AmbientBubbles v-if="!isMobile" />
  </div>
</template>

<style scoped>
.atmosphere-stack {
  z-index: 0;
}

.atmosphere-stack :deep(.atmosphere-bg) { z-index: 0; }
.atmosphere-stack :deep(.atmosphere-agave) { z-index: 1; }
.atmosphere-stack :deep(.atmosphere-clouds) { z-index: 2; }
.atmosphere-stack :deep(.atmosphere-particles) { z-index: 3; }
.atmosphere-stack :deep(.atmosphere-bubbles) { z-index: 4; }
</style>
