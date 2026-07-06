<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalizedLocations } from '../../composables/useLocalizedContent'
import { gsap, scrollTo } from '../../composables/useLenis'
import BeachDecor from '../tropical/BeachDecor.vue'
import MexicoMap from './MexicoMap.vue'

const { t } = useI18n()
const locations = useLocalizedLocations()
const sectionRef = ref(null)
const activeLocation = ref(null)

const listLocations = computed(() =>
  locations.value.filter((l) => l.type !== 'ring' || ['north', 'pacific', 'gulf'].includes(l.id))
)

function selectLocation(loc) {
  activeLocation.value = activeLocation.value?.id === loc.id ? null : loc
}

onMounted(() => {
  gsap.from('.map-heading', { y: 60, opacity: 0, duration: 1, scrollTrigger: { trigger: sectionRef.value, start: 'top 80%' }, clearProps: 'opacity,transform' })
  gsap.from('.map-container', { scale: 0.92, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.value, start: 'top 75%' }, clearProps: 'opacity,transform' })
})
</script>

<template>
  <section id="map" ref="sectionRef" data-nav-contrast="dark" class="relative overflow-hidden bg-[#2A7A72] py-24 text-white md:py-40">
    <BeachDecor />
    <div class="tropical-grain pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden="true" />
    <div class="content-layer mx-auto max-w-7xl px-5 md:px-8">
      <div class="map-heading mb-12 md:mb-16">
        <p class="mb-3 font-body text-sm tracking-[0.3em] text-white/70 uppercase">{{ t('map.eyebrow') }}</p>
        <h2 class="font-display text-4xl font-bold md:text-6xl">
          {{ t('map.title') }} <span class="text-[#E8C84A]">{{ t('map.titleHighlight') }}</span>
        </h2>
        <p class="mt-4 max-w-lg font-body text-base text-white/70 md:text-lg">{{ t('map.intro') }}</p>
      </div>

      <div class="grid gap-8 lg:grid-cols-5">
        <div class="map-container relative overflow-hidden rounded-3xl bg-[#1f5c56]/60 p-4 shadow-xl md:p-6 lg:col-span-3">
          <MexicoMap
            :markers="locations"
            :active-id="activeLocation?.id"
            @select="selectLocation"
          />
          <Transition name="tooltip">
            <div v-if="activeLocation" class="absolute bottom-4 left-4 right-4 z-20 rounded-2xl glass-dark p-4 md:bottom-6 md:left-6 md:right-auto md:max-w-xs">
              <h3 class="font-display text-lg font-bold text-white">{{ activeLocation.name }}</h3>
              <p class="font-body text-sm text-white/70">{{ t('map.stores', { count: activeLocation.stores }) }}</p>
            </div>
          </Transition>
        </div>

        <div class="flex max-h-[420px] flex-col justify-start gap-2 overflow-y-auto lg:col-span-2 lg:max-h-none">
          <button
            v-for="loc in listLocations"
            :key="loc.id"
            class="flex shrink-0 items-center justify-between rounded-2xl px-5 py-3.5 text-left transition-all duration-300"
            :class="activeLocation?.id === loc.id ? 'bg-white/15 scale-[1.02]' : 'hover:bg-white/8'"
            @click="selectLocation(loc)"
          >
            <div>
              <p class="font-display text-sm font-bold text-white md:text-base">{{ loc.name }}</p>
              <p class="font-body text-xs text-white/50 md:text-sm">{{ t('map.storesList', { count: loc.stores }) }}</p>
            </div>
            <span
              class="h-2.5 w-2.5 shrink-0 rounded-full"
              :class="activeLocation?.id === loc.id ? 'scale-150 bg-[#E8C84A]' : loc.type === 'ring' ? 'border border-white/70 bg-transparent' : 'bg-[#4AAB9E]'"
            />
          </button>
          <button
            type="button"
            class="mt-2 flex shrink-0 items-center justify-center gap-2 rounded-full bg-white py-3.5 font-display text-sm font-bold text-[#2A7A72] transition-all hover:scale-105"
            @click="scrollTo('#shop', { offset: -96 })"
          >
            <img src="/images/store_icon.png" alt="" class="h-4 w-4" />
            {{ t('map.buyShop') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tooltip-enter-active, .tooltip-leave-active { transition: all 0.3s ease; }
.tooltip-enter-from, .tooltip-leave-to { opacity: 0; transform: translateY(8px); }
</style>
