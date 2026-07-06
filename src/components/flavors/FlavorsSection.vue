<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '../../stores/theme'
import { useCartStore } from '../../stores/cart'
import { useLocalizedFlavors } from '../../composables/useLocalizedContent'
import { gsap, scrollTo } from '../../composables/useLenis'
import { getPackIdForFlavor, productVisuals } from '../../data/content'
import { getAtmosphere } from '../../data/atmosphere'
import { useOrganicMotion } from '../../composables/useOrganicMotion'
import { useSectionLife } from '../../composables/useSectionLife'
import AtmosphereStack from '../atmosphere/AtmosphereStack.vue'
import HeroCollage from '../hero/HeroCollage.vue'
import TropicalFoliage from '../tropical/TropicalFoliage.vue'
import TropicalSplash from '../tropical/TropicalSplash.vue'

const { t } = useI18n()
const theme = useThemeStore()
const { activeFlavor, activeFlavorIndex } = storeToRefs(theme)
const cart = useCartStore()
const flavors = useLocalizedFlavors()
const { float, sway, killAll } = useOrganicMotion()

const sectionRef = ref(null)
const bottleBackRef = ref(null)
const bottleFrontRef = ref(null)
const floatWrapRef = ref(null)
const activePanel = ref(0)
const autoplayTimer = ref(null)
const isPaused = ref(false)

const atmo = computed(() => getAtmosphere(activeFlavor.value.id))
const activeLocalized = computed(() => flavors.value[activePanel.value] || flavors.value[0])
const isDarkText = computed(() => activeLocalized.value?.textOnBg === '#2A2018' || theme.activeFlavor.textOnBg === '#2A2018')

const packPrice = computed(() => {
  const id = getPackIdForFlavor(theme.activeFlavor.id)
  return productVisuals.find((p) => p.id === id)?.price ?? 389
})

function addToCart() {
  cart.addItem(getPackIdForFlavor(theme.activeFlavor.id), 1, true)
}

function selectFlavor(index) {
  if (index < 0 || index >= flavors.value.length) return
  activePanel.value = index
  theme.setFlavor(index)
  animateBottles()
}

function next() {
  selectFlavor((activePanel.value + 1) % flavors.value.length)
}

function prev() {
  selectFlavor((activePanel.value - 1 + flavors.value.length) % flavors.value.length)
}

function animateBottles() {
  const targets = [bottleBackRef.value, bottleFrontRef.value].filter(Boolean)
  if (!targets.length) return
  gsap.fromTo(targets,
    { x: (i) => (i === 0 ? -60 : 60), opacity: 0 },
    { x: 0, opacity: (i) => (i === 0 ? 0.5 : 1), duration: 0.8, ease: 'power3.out', stagger: 0.06 },
  )
}

function startOrganicBottle() {
  killAll()
}

function startAutoplay() {
  stopAutoplay()
  autoplayTimer.value = setInterval(() => {
    if (!isPaused.value) next()
  }, 6000)
}

function stopAutoplay() {
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value)
    autoplayTimer.value = null
  }
}

watch(() => theme.activeFlavorIndex, (idx) => {
  if (idx !== activePanel.value) activePanel.value = idx
})

useSectionLife(sectionRef)

onMounted(async () => {
  activePanel.value = theme.activeFlavorIndex
  await nextTick()
  gsap.from('.flavors-heading > *', {
    y: 40, opacity: 0, duration: 1, stagger: 0.08,
    scrollTrigger: { trigger: sectionRef.value, start: 'top 80%', once: true },
    clearProps: 'opacity,transform',
  })
  startOrganicBottle()
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
  killAll()
})
</script>

<template>
  <section
    id="flavors"
    ref="sectionRef"
    data-nav-contrast="auto"
    class="relative overflow-hidden py-16 pb-28 md:min-h-screen md:py-32 md:pb-40"
    @mouseenter="isPaused = true"
    @mouseleave="isPaused = false"
  >
    <AtmosphereStack />
    <div
      class="flavor-tint pointer-events-none absolute inset-0 z-[1]"
      :style="{
        backgroundColor: activeFlavor.bgColor,
        opacity: 0.14,
        boxShadow: `inset 0 0 100px 30px ${atmo.glow}`,
      }"
    />
    <TropicalFoliage compact layered />
    <HeroCollage />
    <div class="tropical-grain pointer-events-none absolute inset-0 z-[6] opacity-[0.025]" aria-hidden="true" />

    <div class="content-layer relative z-10 mx-auto max-w-7xl px-5 md:px-8">
      <div class="flavors-heading mb-8 md:mb-16">
        <p
          class="mb-2 font-body text-xs tracking-[0.3em] uppercase md:mb-3 md:text-sm"
          :style="{ color: isDarkText ? 'rgba(42,32,24,0.5)' : 'rgba(255,255,255,0.7)' }"
        >
          {{ t('flavors.eyebrow') }}
        </p>
        <h2 class="font-display text-3xl font-bold md:text-6xl lg:text-7xl" :style="{ color: activeFlavor.textOnBg }">
          {{ t('flavors.title') }}<br class="hidden sm:block" /><span class="sm:hidden"> </span>{{ t('flavors.titleLine2') }}
        </h2>
        <p
          class="mt-3 max-w-lg font-body text-sm md:mt-4 md:text-base"
          :style="{ color: isDarkText ? 'rgba(42,32,24,0.65)' : 'rgba(255,255,255,0.75)' }"
        >
          {{ t('flavors.intro') }}
        </p>
      </div>

      <div class="mb-6 flex items-center gap-2 md:mb-10 md:gap-3">
        <button
          class="magnetic-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all glass-ice md:h-10 md:w-10"
          :aria-label="t('flavors.prev')"
          @click="prev"
        >
          <span :class="isDarkText ? 'text-[#2A2018]' : 'text-white'">←</span>
        </button>

        <div class="flex flex-1 gap-2 overflow-x-auto hide-scrollbar md:flex-wrap md:overflow-visible" data-lenis-prevent>
          <button
            v-for="(flavor, idx) in flavors"
            :key="flavor.id"
            class="glass-ice shrink-0 rounded-full px-3.5 py-2 font-display text-xs font-semibold transition-all duration-500 md:px-6 md:py-2.5 md:text-base"
            :class="activePanel === idx ? 'scale-105 shadow-lg' : 'opacity-80 hover:opacity-100'"
            :style="activePanel === idx ? { background: '#fff', color: '#2A2018' } : { color: activeFlavor.textOnBg }"
            @click="selectFlavor(idx)"
          >
            <img :src="flavor.ingredients[0]?.img" alt="" class="mr-1 inline-block h-4 w-4 object-contain align-middle md:mr-1.5 md:h-5 md:w-5" />
            {{ flavor.name.split(' &')[0] }}
          </button>
        </div>

        <button
          class="magnetic-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-full glass-ice md:h-10 md:w-10"
          :aria-label="t('flavors.next')"
          @click="next"
        >
          <span :class="isDarkText ? 'text-[#2A2018]' : 'text-white'">→</span>
        </button>
      </div>

      <div class="grid items-center gap-6 md:gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="relative flex min-h-[240px] items-center justify-center sm:min-h-[300px] md:min-h-[360px]">
          <Transition name="flavor" mode="out-in">
            <div :key="activeLocalized.id" ref="floatWrapRef" class="relative flex items-end justify-center">
              <img
                ref="bottleBackRef"
                :src="theme.activeFlavor.bottle"
                alt=""
                aria-hidden="true"
                class="absolute left-[10%] h-[28vh] max-h-[260px] w-auto -rotate-6 object-contain opacity-45 sm:left-[8%] sm:h-[32vh] sm:max-h-[320px] sm:opacity-50 md:left-[12%] md:h-[38vh] md:max-h-[380px]"
                loading="lazy"
              />
              <img
                ref="bottleFrontRef"
                :src="theme.activeFlavor.bottle"
                :alt="activeLocalized.name"
                class="relative z-10 h-[34vh] max-h-[300px] w-auto translate-x-1 object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.18)] sm:h-[38vh] sm:max-h-[380px] sm:translate-x-2 md:h-[42vh] md:max-h-[460px] md:drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
                loading="lazy"
              />
            </div>
          </Transition>
        </div>

        <div>
          <Transition name="flavor" mode="out-in">
            <div :key="activeLocalized.id" class="glass-ice rounded-3xl p-5 md:p-8">
              <img :src="theme.activeFlavor.title" :alt="activeLocalized.name" class="mb-2 h-6 w-auto max-w-[140px] md:mb-4 md:h-12 md:max-w-[300px]" loading="lazy" />
              <h3 class="mb-1.5 font-display text-xl font-bold md:mb-2 md:text-3xl" :style="{ color: isDarkText ? '#2A2018' : activeFlavor.textOnBg }">{{ activeLocalized.name }}</h3>
              <p class="mb-2 font-editorial text-lg italic md:text-2xl" :style="{ color: isDarkText ? 'rgba(42,32,24,0.85)' : 'rgba(255,255,255,0.9)' }">
                {{ activeLocalized.tagline }}
              </p>
              <p
                class="mb-4 font-body text-sm leading-relaxed md:mb-6 md:text-lg"
                :style="{ color: isDarkText ? 'rgba(42,32,24,0.7)' : 'rgba(255,255,255,0.8)' }"
              >
                {{ activeLocalized.description }}
              </p>
              <ul class="mb-5 flex gap-3 overflow-x-auto hide-scrollbar md:mb-8 md:block md:space-y-2 md:overflow-visible" data-lenis-prevent>
                <li
                  v-for="ing in activeLocalized.ingredients"
                  :key="ing.key"
                  class="flex shrink-0 items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 font-body text-xs md:shrink md:rounded-none md:bg-transparent md:px-0 md:py-0 md:text-base"
                  :style="{ color: isDarkText ? '#2A2018' : activeFlavor.textOnBg }"
                >
                  <img :src="ing.img" :alt="ing.label" class="h-6 w-6 object-contain md:h-8 md:w-8" />
                  <span>{{ ing.label }}</span>
                </li>
              </ul>
              <div class="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3">
                <button
                  class="magnetic-btn rounded-full bg-[#2A7A72] px-6 py-3 font-display text-sm font-bold text-white shadow-md transition-all md:text-base"
                  @click="addToCart"
                >
                  {{ t('flavors.addToCart', { price: packPrice }) }}
                </button>
                <button
                  class="magnetic-btn rounded-full border px-6 py-3 font-display text-sm font-bold shadow-sm transition-all md:text-base"
                  :class="isDarkText ? 'border-[#2A2018]/30 text-[#2A2018]' : 'border-white/40 text-white'"
                  @click="scrollTo('#story', { offset: -96 })"
                >
                  {{ t('flavors.learnMore') }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <div class="mt-6 flex justify-center gap-1.5 md:mt-10 md:gap-2">
        <button
          v-for="(flavor, idx) in flavors"
          :key="`dot-${flavor.id}`"
          class="h-1.5 rounded-full transition-all duration-500 md:h-2"
          :class="activePanel === idx ? 'w-7 bg-white md:w-8' : 'w-1.5 bg-white/40 md:w-2'"
          :aria-label="flavor.name"
          @click="selectFlavor(idx)"
        />
      </div>
    </div>

    <TropicalSplash class="relative z-10 md:hidden" :color="theme.activeFlavor.waveColor" simple />
    <TropicalSplash class="relative z-10 hidden md:block" :color="theme.activeFlavor.waveColor" animated ocean />
  </section>
</template>

<style scoped>
.flavor-enter-active, .flavor-leave-active { transition: all 0.7s ease; }
.flavor-enter-from { opacity: 0; transform: translateY(20px) scale(0.96); filter: blur(4px); }
.flavor-leave-to { opacity: 0; transform: translateY(-16px) scale(0.96); filter: blur(4px); }
</style>
