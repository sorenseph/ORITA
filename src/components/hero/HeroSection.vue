<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '../../stores/theme'
import { useLocalizedFlavors } from '../../composables/useLocalizedContent'
import { gsap, ScrollTrigger, scrollTo } from '../../composables/useLenis'
import { useCartStore } from '../../stores/cart'
import { getPackIdForFlavor, productVisuals } from '../../data/content'
import HeroBottle from './HeroBottle.vue'
import HeroCollage from './HeroCollage.vue'
import TropicalFoliage from '../tropical/TropicalFoliage.vue'
import TropicalSplash from '../tropical/TropicalSplash.vue'

const { t } = useI18n()
const cart = useCartStore()
const theme = useThemeStore()
const { activeFlavor, activeFlavorIndex } = storeToRefs(theme)
const flavors = useLocalizedFlavors()

const sectionRef = ref(null)
const headlineRef = ref(null)
const scrollProgress = ref(0)
const autoplayTimer = ref(null)
const isPaused = ref(false)

const currentFlavor = computed(() => flavors.value[activeFlavorIndex.value])
const editorialLine = computed(() => t(`hero.taglines.${activeFlavor.value.id}`))
const duoLine = computed(() => {
  const key = activeFlavor.value.id
  return ['guava', 'hibiscus'].includes(key) ? t('hero.duo') : null
})
const isDarkText = computed(() => activeFlavor.value.textOnBg === '#2A2018')

const packPrice = computed(() => {
  const id = getPackIdForFlavor(activeFlavor.value.id)
  return productVisuals.find((p) => p.id === id)?.price ?? 389
})

function addToCart() {
  cart.addItem(getPackIdForFlavor(activeFlavor.value.id), 1, true)
}

function goToFlavor(index) {
  theme.setFlavor(index)
  animateHeadline()
}

function nextFlavor() {
  theme.setFlavor((activeFlavorIndex.value + 1) % flavors.value.length)
  animateHeadline()
}

function animateHeadline() {
  if (!headlineRef.value) return
  gsap.fromTo(headlineRef.value, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
}

function resetAutoplay() {
  if (autoplayTimer.value) clearInterval(autoplayTimer.value)
  autoplayTimer.value = setInterval(() => {
    if (!isPaused.value) nextFlavor()
  }, 5500)
}

onMounted(() => {
  gsap.from('.hero-copy > *', {
    y: 32, opacity: 0, duration: 0.9, stagger: 0.1, delay: 0.15, ease: 'power3.out', clearProps: 'all',
  })

  ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top top',
    end: 'bottom top',
    scrub: 0.4,
    onUpdate: (self) => { scrollProgress.value = self.progress },
  })

  resetAutoplay()
})

onUnmounted(() => {
  if (autoplayTimer.value) clearInterval(autoplayTimer.value)
})
</script>

<template>
  <section
    id="hero"
    ref="sectionRef"
    data-nav-contrast="auto"
    class="relative h-screen min-h-[640px]"
    @mouseenter="isPaused = true"
    @mouseleave="isPaused = false"
  >
    <div
      class="sticky top-0 flex h-[100svh] min-h-[640px] w-full flex-col transition-colors duration-700 ease-out"
      :style="{ backgroundColor: activeFlavor.bgColor }"
    >
      <TropicalFoliage :scroll-progress="scrollProgress" />
      <HeroCollage :scroll-progress="scrollProgress" />
      <div class="tropical-grain pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden="true" />

      <div class="hero-layout relative z-10 mx-auto grid h-full min-h-0 w-full max-w-7xl grid-rows-[1fr_auto] gap-2 px-4 pb-[6.25rem] pt-[5rem] sm:px-6 md:grid-cols-2 md:grid-rows-1 md:items-center md:gap-8 md:px-10 md:pb-[7rem] md:pt-[5.5rem] lg:gap-10">
        <div class="hero-bottles order-1 flex min-h-0 w-full items-end justify-center md:order-2 md:items-center md:self-stretch">
          <HeroBottle :scroll-progress="scrollProgress" />
        </div>

        <div class="hero-copy order-2 flex min-h-0 flex-col justify-end pb-1 md:order-1 md:justify-center md:pb-0">
          <p
            class="mb-1.5 font-body text-[11px] font-medium tracking-[0.35em] uppercase sm:text-xs md:mb-2 md:text-sm"
            :style="{ color: isDarkText ? 'rgba(42,32,24,0.55)' : 'rgba(255,255,255,0.75)' }"
          >
            {{ t('hero.eyebrow') }}
          </p>
          <Transition name="title-fade" mode="out-in">
            <img
              :key="activeFlavor.id"
              :src="activeFlavor.title"
              :alt="currentFlavor?.name"
              class="mb-2 h-7 w-auto max-w-[200px] sm:h-8 md:mb-3 md:h-10 md:max-w-[280px]"
            />
          </Transition>
          <Transition name="title-fade" mode="out-in">
            <p
              :key="`name-${activeFlavor.id}`"
              class="font-display text-sm font-bold uppercase tracking-wider sm:text-base md:text-lg"
              :style="{ color: isDarkText ? '#2A2018' : '#fff' }"
            >
              {{ currentFlavor?.name }}
            </p>
          </Transition>
          <p
            v-if="duoLine"
            class="mt-0.5 font-editorial text-base italic sm:text-lg md:mt-1 md:text-xl"
            :style="{ color: isDarkText ? 'rgba(42,32,24,0.65)' : 'rgba(255,255,255,0.8)' }"
          >
            {{ duoLine }}
          </p>
          <p
            ref="headlineRef"
            class="mt-2 font-editorial text-[clamp(1.35rem,4.2vw,2.4rem)] leading-[1.12] tracking-tight md:mt-4"
            :style="{ color: isDarkText ? '#2A2018' : '#fff' }"
          >
            {{ editorialLine }}
          </p>
          <p
            class="mt-1.5 max-w-md font-body text-[13px] leading-relaxed sm:text-sm md:mt-3 md:text-base"
            :style="{ color: isDarkText ? 'rgba(42,32,24,0.7)' : 'rgba(255,255,255,0.85)' }"
          >
            {{ t('hero.subtitle') }}
          </p>

          <div class="mt-3 flex flex-wrap items-center gap-2 sm:mt-4 md:mt-6 md:gap-2.5">
            <button
              class="group flex items-center gap-2 rounded-full px-4 py-2 font-display text-xs font-bold shadow-lg transition-all hover:scale-105 sm:px-5 sm:py-2.5 sm:text-sm"
              :class="isDarkText ? 'bg-[#2A2018] text-white' : 'bg-white text-[#2A2018]'"
              @click="scrollTo('#story', { offset: -96 })"
            >
              {{ t('hero.cta') }}
              <span class="transition-transform group-hover:translate-x-1">→</span>
            </button>
            <button
              class="flex items-center gap-2 rounded-full bg-[#2A7A72] px-3.5 py-2 font-display text-xs font-bold text-white shadow-md transition-all hover:scale-105 sm:px-4 sm:py-2.5 sm:text-sm"
              @click="addToCart"
            >
              {{ t('flavors.addToCart', { price: packPrice }) }}
            </button>
            <button
              class="rounded-full border px-3.5 py-2 font-display text-xs font-semibold transition-all hover:scale-105 sm:px-4 sm:py-2.5 sm:text-sm"
              :class="isDarkText ? 'border-[#2A2018]/25 text-[#2A2018]' : 'border-white/40 text-white hover:bg-white/10'"
              @click="scrollTo('#flavors', { offset: -96 })"
            >
              {{ t('hero.exploreFlavors') }}
            </button>
          </div>

          <div class="mt-2.5 flex flex-wrap gap-1.5 sm:mt-3 md:mt-4">
            <button
              v-for="(flavor, idx) in flavors"
              :key="flavor.id"
              class="flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-all duration-300 sm:px-3 sm:py-1.5"
              :class="idx === activeFlavorIndex ? 'scale-105 bg-white shadow-md' : 'bg-white/20 hover:bg-white/30'"
              @click="goToFlavor(idx)"
            >
              <img :src="flavor.ingredients[0]?.img" alt="" class="h-4 w-4 object-contain sm:h-5 sm:w-5" />
              <span
                class="font-display text-[11px] font-semibold sm:text-xs"
                :class="idx === activeFlavorIndex ? 'text-[#2A2018]' : isDarkText ? 'text-[#2A2018]/80' : 'text-white/90'"
              >
                {{ flavor.name.split(' &')[0] }}
              </span>
            </button>
          </div>

          <div class="mt-2 flex items-center gap-2 sm:mt-2.5 md:mt-3">
            <button
              v-for="(flavor, idx) in flavors"
              :key="`dot-${flavor.id}`"
              class="rounded-full border-2 transition-all duration-300"
              :class="idx === activeFlavorIndex ? 'h-3 w-3 scale-110 border-[#4AAB9E]' : 'h-2 w-2 opacity-70 hover:opacity-100'"
              :style="{
                background: idx === activeFlavorIndex ? flavor.bgColor : `${flavor.bgColor}88`,
                borderColor: isDarkText ? 'rgba(42,32,24,0.25)' : 'rgba(255,255,255,0.5)',
              }"
              :aria-label="flavor.name"
              @click="goToFlavor(idx)"
            />
          </div>
        </div>
      </div>

      <div class="absolute bottom-[5rem] right-3 z-30 flex items-end gap-3 sm:right-5 md:bottom-[5.5rem] md:right-10 md:gap-4">
        <div class="hidden flex-col items-center gap-0.5 text-[10px] font-body tracking-widest uppercase sm:flex sm:text-xs" :class="isDarkText ? 'text-[#2A2018]/50' : 'text-white/60'">
          <span>{{ t('hero.scroll') }}</span>
          <span class="animate-bounce">↓</span>
        </div>
        <img src="/images/medals.png" :alt="t('hero.awards')" class="h-9 drop-shadow-md sm:h-11 md:h-12 lg:h-14" loading="lazy" />
      </div>

      <TropicalSplash color="#F7F0E3" simple />
    </div>
  </section>
</template>

<style scoped>
.hero-bottles {
  min-height: 0;
}

@media (max-width: 767px) {
  .hero-bottles {
    max-height: 52svh;
  }
}

.title-fade-enter-active, .title-fade-leave-active { transition: opacity 0.35s ease; }
.title-fade-enter-from, .title-fade-leave-to { opacity: 0; }
</style>
