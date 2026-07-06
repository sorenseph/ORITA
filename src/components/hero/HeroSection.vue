<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWindowSize } from '@vueuse/core'
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
const scrollProgress = ref(0)
const autoplayTimer = ref(null)
const isPaused = ref(false)
const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

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

const mutedText = computed(() =>
  isDarkText.value ? 'rgba(42,32,24,0.55)' : 'rgba(255,255,255,0.75)',
)
const bodyText = computed(() =>
  isDarkText.value ? 'rgba(42,32,24,0.7)' : 'rgba(255,255,255,0.85)',
)
const primaryText = computed(() => (isDarkText.value ? '#2A2018' : '#fff'))

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
  document.querySelectorAll('.hero-headline').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
  })
}

onMounted(() => {
  gsap.from('.hero-copy > *', {
    y: 20, opacity: 0, duration: 0.8, stagger: 0.06, delay: 0.1, ease: 'power3.out', clearProps: 'all',
  })

  ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top top',
    end: 'bottom top',
    scrub: 0.4,
    onUpdate: (self) => { scrollProgress.value = self.progress },
  })

  autoplayTimer.value = setInterval(() => {
    if (!isPaused.value) nextFlavor()
  }, 5500)
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
    class="relative h-screen min-h-[600px]"
    @mouseenter="isPaused = true"
    @mouseleave="isPaused = false"
  >
    <div
      class="sticky top-0 flex h-[100svh] min-h-[600px] w-full flex-col overflow-hidden transition-colors duration-700 ease-out"
      :style="{ backgroundColor: activeFlavor.bgColor }"
    >
      <TropicalFoliage :compact="isMobile" :scroll-progress="scrollProgress" />
      <HeroCollage :scroll-progress="scrollProgress" />
      <div class="tropical-grain pointer-events-none absolute inset-0 opacity-[0.03] md:opacity-[0.05]" aria-hidden="true" />

      <div
        class="hero-layout content-layer relative mx-auto grid h-full min-h-0 w-full max-w-7xl
          grid-rows-[minmax(0,1.2fr)_auto]
          gap-0 px-4 pb-[5rem] pt-[4.5rem]
          md:grid-cols-2 md:grid-rows-1 md:items-center md:gap-8 md:px-10 md:pb-[7rem] md:pt-[5.5rem] lg:gap-10"
      >
        <div class="hero-visual order-1 flex min-h-0 items-end justify-center self-stretch md:order-2 md:items-center">
          <HeroBottle :scroll-progress="scrollProgress" />
        </div>

        <div class="hero-copy order-2 flex min-h-0 flex-col justify-end pb-1 md:order-1 md:justify-center md:pb-0">
          <p
            class="mb-0.5 font-body text-[10px] font-medium tracking-[0.32em] uppercase md:mb-2 md:text-sm"
            :style="{ color: mutedText }"
          >
            {{ t('hero.eyebrow') }}
          </p>

          <Transition name="title-fade" mode="out-in">
            <img
              :key="activeFlavor.id"
              :src="activeFlavor.title"
              :alt="currentFlavor?.name"
              class="hero-title-art mb-0.5 w-auto md:mb-2"
            />
          </Transition>

          <Transition name="title-fade" mode="out-in">
            <p
              :key="`name-${activeFlavor.id}`"
              class="hidden font-display text-lg font-bold uppercase tracking-wider md:block"
              :style="{ color: primaryText }"
            >
              {{ currentFlavor?.name }}
            </p>
          </Transition>

          <p
            v-if="duoLine"
            class="mt-0.5 hidden font-editorial text-base italic md:block md:text-xl"
            :style="{ color: bodyText }"
          >
            {{ duoLine }}
          </p>

          <p
            class="hero-headline mt-0.5 font-editorial text-[clamp(1.05rem,4.2vw,1.35rem)] leading-[1.2] tracking-tight md:mt-4 md:text-[clamp(1.35rem,4.2vw,2.4rem)] md:leading-[1.12]"
            :style="{ color: primaryText }"
          >
            {{ editorialLine }}
          </p>

          <p
            class="mt-1 hidden max-w-md font-body text-base leading-relaxed md:mt-3 md:block"
            :style="{ color: bodyText }"
          >
            {{ t('hero.subtitle') }}
          </p>

          <div class="mt-2.5 grid grid-cols-2 gap-2 md:mt-6 md:flex md:flex-wrap md:items-center md:gap-2.5">
            <button
              class="group flex items-center justify-center gap-1.5 rounded-full px-3 py-2 font-display text-[11px] font-bold shadow-lg transition-all active:scale-[0.98] md:px-5 md:py-2.5 md:text-sm md:hover:scale-105"
              :class="isDarkText ? 'bg-[#2A2018] text-white' : 'bg-white text-[#2A2018]'"
              @click="scrollTo('#story', { offset: -96 })"
            >
              {{ t('hero.cta') }}
              <span class="hidden transition-transform group-hover:translate-x-1 md:inline">→</span>
            </button>
            <button
              class="flex items-center justify-center rounded-full bg-[#2A7A72] px-3 py-2 font-display text-[11px] font-bold text-white shadow-md transition-all active:scale-[0.98] md:px-4 md:py-2.5 md:text-sm md:hover:scale-105"
              @click="addToCart"
            >
              <span class="md:hidden">{{ t('hero.addShort', { price: packPrice }) }}</span>
              <span class="hidden md:inline">{{ t('flavors.addToCart', { price: packPrice }) }}</span>
            </button>
            <button
              class="col-span-2 hidden rounded-full border px-4 py-2 font-display text-xs font-semibold transition-all hover:scale-105 md:col-span-1 md:inline-flex md:py-2.5 md:text-sm"
              :class="isDarkText ? 'border-[#2A2018]/25 text-[#2A2018]' : 'border-white/40 text-white hover:bg-white/10'"
              @click="scrollTo('#flavors', { offset: -96 })"
            >
              {{ t('hero.exploreFlavors') }}
            </button>
          </div>

          <div class="hide-scrollbar mt-2 hidden gap-1.5 overflow-x-auto md:mt-4 md:flex md:flex-wrap md:overflow-visible">
            <button
              v-for="(flavor, idx) in flavors"
              :key="flavor.id"
              class="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 transition-all duration-300"
              :class="idx === activeFlavorIndex ? 'scale-105 bg-white shadow-md' : 'bg-white/20 hover:bg-white/30'"
              @click="goToFlavor(idx)"
            >
              <img :src="flavor.ingredients[0]?.img" alt="" class="h-5 w-5 object-contain" />
              <span
                class="font-display text-xs font-semibold"
                :class="idx === activeFlavorIndex ? 'text-[#2A2018]' : isDarkText ? 'text-[#2A2018]/80' : 'text-white/90'"
              >
                {{ flavor.name.split(' &')[0] }}
              </span>
            </button>
          </div>

          <div class="mt-2 flex items-center justify-between gap-3 md:mt-3 md:justify-start">
            <div class="flex items-center gap-2">
              <button
                v-for="(flavor, idx) in flavors"
                :key="`dot-${flavor.id}`"
                class="rounded-full border-2 transition-all duration-300"
                :class="idx === activeFlavorIndex ? 'h-2.5 w-2.5 scale-110 border-[#4AAB9E] md:h-3 md:w-3' : 'h-1.5 w-1.5 opacity-70 md:h-2 md:w-2'"
                :style="{
                  background: idx === activeFlavorIndex ? flavor.bgColor : `${flavor.bgColor}88`,
                  borderColor: isDarkText ? 'rgba(42,32,24,0.25)' : 'rgba(255,255,255,0.5)',
                }"
                :aria-label="flavor.name"
                @click="goToFlavor(idx)"
              />
            </div>
            <button
              class="font-body text-[11px] font-medium underline-offset-2 hover:underline md:hidden"
              :style="{ color: bodyText }"
              @click="scrollTo('#flavors', { offset: -96 })"
            >
              {{ t('hero.exploreFlavors') }}
            </button>
          </div>
        </div>
      </div>

      <div class="absolute bottom-[5rem] right-3 z-30 hidden items-end gap-2 sm:flex md:bottom-[5.5rem] md:right-10 md:gap-4">
        <div
          class="hidden flex-col items-center gap-0.5 font-body text-xs tracking-widest uppercase md:flex"
          :class="isDarkText ? 'text-[#2A2018]/50' : 'text-white/60'"
        >
          <span>{{ t('hero.scroll') }}</span>
          <span class="animate-bounce">↓</span>
        </div>
        <img
          src="/images/medals.png"
          :alt="t('hero.awards')"
          class="h-9 drop-shadow-md md:h-12 lg:h-14"
          loading="lazy"
        />
      </div>

      <TropicalSplash color="#F7F0E3" simple />
    </div>
  </section>
</template>

<style scoped>
.hero-title-art {
  height: 1.125rem;
  max-width: 7.5rem;
}

@media (min-width: 640px) {
  .hero-title-art {
    height: 1.375rem;
    max-width: 9rem;
  }
}

@media (min-width: 768px) {
  .hero-title-art {
    height: 2.5rem;
    max-width: 17.5rem;
  }
}

@media (max-width: 767px) {
  .hero-visual {
    min-height: 48svh;
    max-height: 54svh;
  }
}

.title-fade-enter-active,
.title-fade-leave-active {
  transition: opacity 0.3s ease;
}

.title-fade-enter-from,
.title-fade-leave-to {
  opacity: 0;
}
</style>
