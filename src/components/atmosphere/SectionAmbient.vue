<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '../../stores/theme'
import { getAtmosphere } from '../../data/atmosphere'
import { getSectionAmbient } from '../../data/sectionAmbients'
import { useMouseDepth } from '../../composables/useMouseDepth'
import AmbientParticles from './AmbientParticles.vue'
import AmbientBubbles from './AmbientBubbles.vue'

const props = defineProps({
  variant: { type: String, default: 'sand' }, // sand | ocean | tropical | flavor
  intensity: { type: Number, default: 0.65 },
  showBubbles: { type: Boolean, default: true },
  showParticles: { type: Boolean, default: true },
})

const theme = useThemeStore()
const { activeFlavor } = storeToRefs(theme)
const { mx, my } = useMouseDepth()

const palette = computed(() => {
  if (props.variant === 'flavor') return getAtmosphere(activeFlavor.value.id)
  return getSectionAmbient(props.variant)
})

const meshStyle = computed(() => ({
  background: `linear-gradient(135deg, ${palette.value.gradient.join(', ')})`,
  backgroundSize: '220% 220%',
  transform: `translate3d(${mx.value * 6}px, ${my.value * 4}px, 0)`,
  opacity: props.intensity,
}))

const mistStyle = computed(() => ({
  background: `radial-gradient(ellipse 80% 55% at 50% 100%, ${palette.value.mist}, transparent 68%)`,
  transform: `translate3d(${mx.value * 4}px, ${my.value * 3}px, 0)`,
}))
</script>

<template>
  <div class="section-ambient pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <div class="section-ambient-mesh absolute inset-0" :style="meshStyle" />
    <div class="section-ambient-mist absolute inset-0" :style="mistStyle" />
    <AmbientParticles
      v-if="showParticles"
      :density="intensity * 0.55"
      :hues="palette.particleHues"
      :wind="palette.wind"
    />
    <AmbientBubbles
      v-if="showBubbles"
      :tint="palette.bubbleTint"
      :count="Math.round(8 * intensity)"
    />
  </div>
</template>

<style scoped>
.section-ambient-mesh {
  animation: meshDrift 22s ease-in-out infinite;
}

.section-ambient-mist {
  animation: mistPulse 11s ease-in-out infinite;
}

@keyframes meshDrift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes mistPulse {
  0%, 100% { opacity: 0.75; }
  50% { opacity: 1; }
}
</style>
