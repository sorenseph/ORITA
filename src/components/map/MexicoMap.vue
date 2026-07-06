<script setup>
import { ref, computed } from 'vue'
import { mapConnections } from '../../data/content'

const props = defineProps({
  markers: { type: Array, required: true },
  activeId: { type: String, default: null },
})

const emit = defineEmits(['select'])

const VB = { w: 606.73, h: 416.78 }

const markerById = computed(() =>
  Object.fromEntries(props.markers.map((m) => [m.id, m])),
)

const connectionLines = computed(() =>
  mapConnections
    .map(([from, to]) => {
      const a = markerById.value[from]
      const b = markerById.value[to]
      if (!a || !b) return null
      return { from, to, x1: a.svgX, y1: a.svgY, x2: b.svgX, y2: b.svgY }
    })
    .filter(Boolean),
)

function lineActive(line) {
  if (!props.activeId) return false
  return line.from === props.activeId || line.to === props.activeId
}
</script>

<template>
  <div class="relative w-full">
    <svg
      :viewBox="`0 0 ${VB.w} ${VB.h}`"
      class="h-auto w-full"
      role="img"
      aria-label="Mapa de México"
    >
      <defs>
        <filter id="map-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <image
        href="/svg/map-mexico.svg"
        width="606.73"
        height="416.78"
        opacity="0.38"
        style="filter: brightness(0) invert(1)"
      />

      <!-- Conexiones punteadas entre puntos -->
      <g aria-hidden="true">
        <line
          v-for="line in connectionLines"
          :key="`${line.from}-${line.to}`"
          :x1="line.x1"
          :y1="line.y1"
          :x2="line.x2"
          :y2="line.y2"
          stroke="#F7F0E3"
          stroke-width="1.5"
          stroke-dasharray="4 6"
          stroke-linecap="round"
          :opacity="lineActive(line) ? 0.85 : 0.4"
          class="transition-opacity duration-300"
        />
      </g>

      <g
        v-for="m in markers"
        :key="m.id"
        class="cursor-pointer"
        filter="url(#map-glow)"
        @click="emit('select', m)"
      >
        <template v-if="m.type === 'ring'">
          <circle
            :cx="m.svgX"
            :cy="m.svgY"
            r="10"
            fill="none"
            stroke="#F7F0E3"
            stroke-width="2.5"
            :opacity="activeId === m.id ? 1 : 0.75"
          />
          <circle
            v-if="activeId === m.id"
            :cx="m.svgX"
            :cy="m.svgY"
            r="14"
            fill="none"
            stroke="#E8C84A"
            stroke-width="1.5"
            opacity="0.6"
          >
            <animate attributeName="r" from="10" to="20" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </template>
        <template v-else>
          <circle
            :cx="m.svgX"
            :cy="m.svgY"
            r="8"
            :fill="activeId === m.id ? '#E8C84A' : '#4AAB9E'"
            stroke="#F7F0E3"
            stroke-width="2"
          />
          <circle
            v-if="activeId === m.id"
            :cx="m.svgX"
            :cy="m.svgY"
            r="8"
            fill="none"
            stroke="#E8C84A"
            stroke-width="1.5"
          >
            <animate attributeName="r" from="8" to="18" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="1.2s" repeatCount="indefinite" />
          </circle>
        </template>
      </g>
    </svg>
  </div>
</template>
