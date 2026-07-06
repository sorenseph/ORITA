<script setup>
import { computed } from 'vue'

const props = defineProps({
  flavor: { type: Object, required: true },
})

const c = computed(() => props.flavor.campaign || {
  bg: props.flavor.bgColor,
  accent: '#FFD400',
  layout: 'wedge-tr',
})

const decorStyle = computed(() => {
  const pos = c.value.decorPosition || 'right'
  const map = {
    right: { right: '-4%', bottom: '8%', width: 'min(38vw, 280px)' },
    'right-bottom': { right: '2%', bottom: '12%', width: 'min(32vw, 240px)' },
    left: { left: '-6%', bottom: '10%', width: 'min(34vw, 260px)' },
  }
  const base = map[c.value.decorPosition] || map.right
  return base
})
</script>

<template>
  <div class="flavor-campaign pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <Transition name="campaign" mode="out-in">
      <div :key="flavor.id" class="absolute inset-0">
        <!-- Base sólida -->
        <div class="absolute inset-0" :style="{ background: c.bg }" />

        <!-- Lima: columna amarilla izquierda + plataforma -->
        <template v-if="c.layout === 'split-lime'">
          <div
            class="absolute bottom-0 left-0 top-0 w-[26%] md:w-[22%]"
            :style="{ background: c.accent }"
          />
          <div
            class="absolute bottom-0 left-0 right-0 h-[22%] md:h-[24%]"
            :style="{ background: c.accent }"
          />
        </template>

        <!-- Guayaba / Jamaica: diagonal amarilla arriba-derecha -->
        <div
          v-else-if="c.layout === 'wedge-tr'"
          class="absolute inset-0"
          :style="{
            background: c.accent,
            clipPath: 'polygon(62% 0, 100% 0, 100% 46%)',
          }"
        />

        <!-- Tamarindo: bloque crema abajo-izquierda -->
        <div
          v-else-if="c.layout === 'wedge-bl'"
          class="absolute inset-0"
          :style="{
            background: c.accent,
            clipPath: 'polygon(0 55%, 0 100%, 48% 100%, 0 78%)',
          }"
        />
        <div
          v-if="c.layout === 'wedge-bl' && c.accent2"
          class="absolute right-0 top-0 h-[38%] w-[32%] md:w-[26%]"
          :style="{ background: c.accent2 }"
        />

        <!-- Plataforma inferior (guayaba/jamaica) -->
        <div
          v-if="c.platform"
          class="absolute bottom-0 left-0 right-0"
          :style="{ height: c.platformHeight || '16%', background: c.platform }"
        />

        <!-- Fruta decorativa -->
        <img
          v-if="c.decor"
          :src="c.decor"
          alt=""
          class="absolute object-contain opacity-[0.18] md:opacity-[0.22]"
          :style="decorStyle"
          loading="lazy"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.campaign-enter-active,
.campaign-leave-active {
  transition: opacity 0.45s ease;
}

.campaign-enter-from,
.campaign-leave-to {
  opacity: 0;
}
</style>
