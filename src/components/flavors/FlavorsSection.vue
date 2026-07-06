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
import { useSectionLife } from '../../composables/useSectionLife'
import { useVisibilityPause } from '../../composables/useVisibilityPause'
import SectionAmbient from '../atmosphere/SectionAmbient.vue'
import BottleFizzFx from './BottleFizzFx.vue'
import TropicalSplash from '../tropical/TropicalSplash.vue'

const INK = '#2A2018'
const INK_MUTED = 'rgba(42,32,24,0.65)'
const INK_SOFT = 'rgba(42,32,24,0.5)'

const { t } = useI18n()
const theme = useThemeStore()
const { activeFlavor, activeFlavorIndex } = storeToRefs(theme)
const cart = useCartStore()
const flavors = useLocalizedFlavors()

const sectionRef = ref(null)
const bottleStageRef = ref(null)
const { isVisible: bottleStageVisible } = useVisibilityPause(bottleStageRef)
const bottleBackRef = ref(null)
const bottleFrontRef = ref(null)
const floatWrapRef = ref(null)
const activePanel = ref(0)
const autoplayTimer = ref(null)
const isPaused = ref(false)

const atmo = computed(() => getAtmosphere(activeFlavor.value.id))
const activeLocalized = computed(() => flavors.value[activePanel.value] || flavors.value[0])
const headingColor = computed(() => activeFlavor.value.textOnBg)
const usesLightHeading = computed(() => headingColor.value === '#FFFFFF')

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
}

function next() {
  selectFlavor((activePanel.value + 1) % flavors.value.length)
}

function prev() {
  selectFlavor((activePanel.value - 1 + flavors.value.length) % flavors.value.length)
}

function animateBottles() {
  nextTick(() => {
    const back = bottleBackRef.value
    const front = bottleFrontRef.value
    if (!back || !front) return

    gsap.killTweensOf([back, front])
    gsap.fromTo(
      back,
      { x: -140, y: 48, rotation: -16, opacity: 0, scale: 0.82 },
      { x: 0, y: 0, rotation: -8, opacity: 0.62, scale: 1, duration: 0.9, ease: 'power3.out' },
    )
    gsap.fromTo(
      front,
      { x: 120, y: 56, rotation: 12, opacity: 0, scale: 0.86 },
      { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out', delay: 0.1 },
    )
  })
}

function onBottleStageEnter() {
  if (floatWrapRef.value) {
    gsap.set(floatWrapRef.value, { clearProps: 'filter,transform,opacity' })
  }
  animateBottles()
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
  startAutoplay()
  onBottleStageEnter()
})

onUnmounted(() => {
  stopAutoplay()
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
    <SectionAmbient
      variant="flavor"
      :intensity="0.92"
      :show-particles="false"
      :show-bubbles="false"
      :enable-parallax="false"
      :animate-mesh="false"
    />
    <div
      class="flavor-tint pointer-events-none absolute inset-0 z-[2]"
      :style="{ boxShadow: `inset 0 0 120px 40px ${atmo.glow}` }"
      aria-hidden="true"
    />
    <div class="tropical-grain pointer-events-none absolute inset-0 z-[3] opacity-[0.04]" aria-hidden="true" />

    <div class="content-layer relative z-10 mx-auto max-w-7xl px-5 md:px-8">
      <div class="flavors-heading mb-8 md:mb-16">
        <p
          class="mb-2 font-body text-xs tracking-[0.3em] uppercase md:mb-3 md:text-sm"
          :style="{ color: usesLightHeading ? 'rgba(255,255,255,0.72)' : INK_SOFT }"
        >
          {{ t('flavors.eyebrow') }}
        </p>
        <h2 class="font-display text-3xl font-bold md:text-6xl lg:text-7xl" :style="{ color: headingColor }">
          {{ t('flavors.title') }}<br class="hidden sm:block" /><span class="sm:hidden"> </span>{{ t('flavors.titleLine2') }}
        </h2>
        <p
          class="mt-3 max-w-lg font-body text-sm md:mt-4 md:text-base"
          :style="{ color: usesLightHeading ? 'rgba(255,255,255,0.82)' : INK_MUTED }"
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
          <span :style="{ color: headingColor }">←</span>
        </button>

        <div class="flex flex-1 gap-2 overflow-x-auto hide-scrollbar md:flex-wrap md:overflow-visible" data-lenis-prevent>
          <button
            v-for="(flavor, idx) in flavors"
            :key="flavor.id"
            class="glass-ice shrink-0 rounded-full px-3.5 py-2 font-display text-xs font-semibold transition-all duration-500 md:px-6 md:py-2.5 md:text-base"
            :class="activePanel === idx ? 'scale-105 shadow-lg' : 'opacity-80 hover:opacity-100'"
            :style="activePanel === idx
              ? { background: '#fff', color: INK }
              : { color: usesLightHeading ? 'rgba(255,255,255,0.92)' : INK }"
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
          <span :style="{ color: headingColor }">→</span>
        </button>
      </div>

      <div class="grid items-end gap-4 md:gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 xl:grid-cols-[1.2fr_0.8fr]">
        <div class="relative mx-auto w-full max-w-[min(100%,520px)] lg:max-w-none">
          <div
            ref="bottleStageRef"
            class="bottle-stage relative flex min-h-[min(72vw,420px)] items-end justify-center sm:min-h-[min(68vw,480px)] md:min-h-[min(62vh,620px)] lg:min-h-[min(68vh,720px)]"
          >
            <div
              class="bottle-glow pointer-events-none absolute bottom-[6%] left-1/2 z-0 h-[14%] w-[72%] -translate-x-1/2 rounded-full blur-3xl"
              :style="{ background: atmo.glow }"
              aria-hidden="true"
            />

            <Transition name="flavor" mode="out-in" @after-enter="onBottleStageEnter">
              <div
                :key="activeLocalized.id"
                ref="floatWrapRef"
                class="bottle-duo relative z-[1] flex w-full items-end justify-center"
              >
                <img
                  ref="bottleBackRef"
                  :src="theme.activeFlavor.bottle"
                  alt=""
                  aria-hidden="true"
                  class="bottle-back absolute bottom-0 left-[2%] h-[min(58vw,380px)] w-auto max-h-[min(58vh,560px)] -rotate-8 object-contain opacity-50 sm:left-[0%] sm:h-[min(54vw,440px)] md:left-[4%] md:h-[min(52vh,520px)] lg:h-[min(56vh,600px)] xl:h-[min(58vh,640px)]"
                  loading="lazy"
                />
                <img
                  ref="bottleFrontRef"
                  :src="theme.activeFlavor.bottle"
                  :alt="activeLocalized.name"
                  class="bottle-front relative z-10 h-[min(68vw,440px)] w-auto max-h-[min(66vh,640px)] translate-x-2 object-contain drop-shadow-[0_20px_48px_rgba(0,0,0,0.22)] sm:h-[min(64vw,500px)] md:h-[min(60vh,580px)] md:translate-x-4 lg:h-[min(64vh,660px)] xl:h-[min(68vh,700px)]"
                  loading="lazy"
                />
                <BottleFizzFx :tint="atmo.bubbleTint" :count="12" :active="bottleStageVisible" />
              </div>
            </Transition>
          </div>
        </div>

        <div>
          <Transition name="flavor" mode="out-in">
            <div :key="activeLocalized.id" class="glass-ice rounded-3xl p-5 md:p-8">
              <img :src="theme.activeFlavor.title" :alt="activeLocalized.name" class="mb-2 h-6 w-auto max-w-[140px] md:mb-4 md:h-12 md:max-w-[300px]" loading="lazy" />
              <h3 class="mb-1.5 font-display text-xl font-bold md:mb-2 md:text-3xl" :style="{ color: INK }">{{ activeLocalized.name }}</h3>
              <p class="mb-2 font-editorial text-lg italic md:text-2xl" :style="{ color: 'rgba(42,32,24,0.88)' }">
                {{ activeLocalized.tagline }}
              </p>
              <p
                class="mb-4 font-body text-sm leading-relaxed md:mb-6 md:text-lg"
                :style="{ color: INK_MUTED }"
              >
                {{ activeLocalized.description }}
              </p>
              <ul class="mb-5 flex gap-3 overflow-x-auto hide-scrollbar md:mb-8 md:block md:space-y-2 md:overflow-visible" data-lenis-prevent>
                <li
                  v-for="ing in activeLocalized.ingredients"
                  :key="ing.key"
                  class="flex shrink-0 items-center gap-2 rounded-full bg-white/55 px-3 py-1.5 font-body text-xs md:shrink md:rounded-none md:bg-transparent md:px-0 md:py-0 md:text-base"
                  :style="{ color: INK }"
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
                  class="magnetic-btn rounded-full border border-[#2A2018]/25 bg-white/40 px-6 py-3 font-display text-sm font-bold text-[#2A2018] shadow-sm transition-all md:text-base"
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
          :class="activePanel === idx ? 'w-7 md:w-8' : 'w-1.5 md:w-2'"
          :style="{ background: activePanel === idx ? activeFlavor.primary : `${activeFlavor.primary}66` }"
          :aria-label="flavor.name"
          @click="selectFlavor(idx)"
        />
      </div>
    </div>

    <TropicalSplash class="relative z-10 md:hidden" :color="theme.activeFlavor.waveColor" :animated="false" simple />
    <TropicalSplash class="relative z-10 hidden md:block" :color="theme.activeFlavor.waveColor" :animated="false" simple />
  </section>
</template>

<style scoped>
.bottle-stage {
  contain: layout style;
}

.bottle-duo {
  width: 100%;
  min-height: inherit;
}

.bottle-back,
.bottle-front {
  transform-origin: bottom center;
}

.flavor-enter-active,
.flavor-leave-active {
  transition: opacity 0.35s ease;
}

.flavor-enter-from,
.flavor-leave-to {
  opacity: 0;
}
</style>
