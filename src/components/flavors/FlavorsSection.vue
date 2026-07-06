<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '../../stores/theme'
import { useCartStore } from '../../stores/cart'
import { useLocalizedFlavors } from '../../composables/useLocalizedContent'
import { gsap, scrollTo } from '../../composables/useLenis'
import { getPackIdForFlavor, productVisuals } from '../../data/content'
import BeachDecor from '../tropical/BeachDecor.vue'
import TropicalSplash from '../tropical/TropicalSplash.vue'

const { t } = useI18n()
const theme = useThemeStore()
const cart = useCartStore()
const flavors = useLocalizedFlavors()

const sectionRef = ref(null)
const activePanel = ref(0)
const autoplayTimer = ref(null)
const isPaused = ref(false)

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
}

function next() {
  selectFlavor((activePanel.value + 1) % flavors.value.length)
}

function prev() {
  selectFlavor((activePanel.value - 1 + flavors.value.length) % flavors.value.length)
}

function startAutoplay() {
  stopAutoplay()
  autoplayTimer.value = setInterval(() => {
    if (!isPaused.value) next()
  }, 5000)
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

onMounted(async () => {
  activePanel.value = theme.activeFlavorIndex
  await nextTick()
  gsap.from('.flavors-heading', {
    y: 60, opacity: 0, duration: 1,
    scrollTrigger: { trigger: sectionRef.value, start: 'top 80%' },
  })
  startAutoplay()
})

onUnmounted(stopAutoplay)
</script>

<template>
  <section
    id="flavors"
    ref="sectionRef"
    data-nav-contrast="auto"
    class="relative min-h-screen overflow-hidden py-24 pb-36 transition-colors duration-700 md:py-32 md:pb-40"
    :style="{ backgroundColor: theme.activeFlavor.bgColor, color: theme.activeFlavor.textOnBg }"
    @mouseenter="isPaused = true"
    @mouseleave="isPaused = false"
  >
    <BeachDecor minimal />
    <div class="tropical-grain pointer-events-none absolute inset-0 opacity-[0.03] md:opacity-[0.06]" aria-hidden="true" />

    <div class="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
      <div class="flavors-heading mb-12 md:mb-16">
        <p
          class="mb-3 font-body text-sm tracking-[0.3em] uppercase"
          :style="{ color: isDarkText ? 'rgba(42,32,24,0.5)' : 'rgba(255,255,255,0.7)' }"
        >
          {{ t('flavors.eyebrow') }}
        </p>
        <h2 class="font-display text-4xl font-bold md:text-6xl lg:text-7xl">
          {{ t('flavors.title') }}<br />{{ t('flavors.titleLine2') }}
        </h2>
        <p
          class="mt-4 max-w-lg font-body text-base"
          :style="{ color: isDarkText ? 'rgba(42,32,24,0.65)' : 'rgba(255,255,255,0.75)' }"
        >
          {{ t('flavors.intro') }}
        </p>
      </div>

      <!-- Tabs + controles carrusel -->
      <div class="mb-10 flex flex-wrap items-center gap-3">
        <button
          class="flex h-10 w-10 items-center justify-center rounded-full transition-all"
          :class="isDarkText ? 'bg-[#2A2018]/10 hover:bg-[#2A2018]/15' : 'bg-white/20 hover:bg-white/30'"
          :aria-label="t('flavors.prev')"
          @click="prev"
        >
          <span :class="isDarkText ? 'text-[#2A2018]' : 'text-white'">←</span>
        </button>

        <div class="flex flex-wrap gap-2 md:gap-3">
          <button
            v-for="(flavor, idx) in flavors"
            :key="flavor.id"
            class="rounded-full px-4 py-2 font-display text-sm font-semibold transition-all duration-300 md:px-6 md:py-2.5 md:text-base"
            :class="activePanel === idx ? 'scale-105 shadow-lg' : 'bg-white/20 hover:bg-white/30'"
            :style="activePanel === idx ? { background: '#fff', color: '#2A2018' } : { color: theme.activeFlavor.textOnBg }"
            @click="selectFlavor(idx)"
          >
            <img :src="flavor.ingredients[0]?.img" alt="" class="mr-1.5 inline-block h-5 w-5 object-contain align-middle" />
            {{ flavor.name.split(' &')[0] }}
          </button>
        </div>

        <button
          class="flex h-10 w-10 items-center justify-center rounded-full transition-all"
          :class="isDarkText ? 'bg-[#2A2018]/10 hover:bg-[#2A2018]/15' : 'bg-white/20 hover:bg-white/30'"
          :aria-label="t('flavors.next')"
          @click="next"
        >
          <span :class="isDarkText ? 'text-[#2A2018]' : 'text-white'">→</span>
        </button>
      </div>

      <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="relative flex min-h-[360px] items-center justify-center">
          <Transition name="flavor" mode="out-in">
            <div :key="activeLocalized.id" class="relative flex items-end justify-center">
              <img
                :src="theme.activeFlavor.bottle"
                alt=""
                aria-hidden="true"
                class="absolute left-[8%] h-[36vh] max-h-[380px] w-auto -rotate-6 object-contain opacity-50 md:left-[12%] md:h-[38vh]"
                loading="lazy"
              />
              <img
                :src="theme.activeFlavor.bottle"
                :alt="activeLocalized.name"
                class="relative z-10 h-[42vh] max-h-[460px] w-auto translate-x-2 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
                loading="lazy"
              />
            </div>
          </Transition>
          <TransitionGroup name="ing">
            <img
              v-for="(ing, i) in activeLocalized.ingredients"
              :key="`${activeLocalized.id}-${ing.key}`"
              :src="ing.img"
              :alt="ing.label"
              class="flavor-float absolute hidden h-16 w-16 object-contain md:block md:h-24 md:w-24"
              :style="{
                top: `${8 + i * 22}%`,
                left: i % 2 === 0 ? '-2%' : 'auto',
                right: i % 2 !== 0 ? '-2%' : 'auto',
                animationDelay: `${i * 0.5}s`,
              }"
              loading="lazy"
            />
          </TransitionGroup>
        </div>

        <div>
          <Transition name="flavor" mode="out-in">
            <div :key="activeLocalized.id">
              <img :src="theme.activeFlavor.title" :alt="activeLocalized.name" class="mb-3 h-7 w-auto max-w-[160px] md:mb-4 md:h-12 md:max-w-[300px]" loading="lazy" />
              <h3 class="mb-2 font-display text-2xl font-bold md:text-3xl">{{ activeLocalized.name }}</h3>
              <p class="mb-2 font-editorial text-xl italic md:text-2xl" :style="{ opacity: 0.9 }">
                {{ activeLocalized.tagline }}
              </p>
              <p
                class="mb-6 font-body text-base leading-relaxed md:text-lg"
                :style="{ color: isDarkText ? 'rgba(42,32,24,0.7)' : 'rgba(255,255,255,0.8)' }"
              >
                {{ activeLocalized.description }}
              </p>
              <ul class="mb-8 space-y-2">
                <li
                  v-for="ing in activeLocalized.ingredients"
                  :key="ing.key"
                  class="flex items-center gap-3 font-body text-sm md:text-base"
                >
                  <img :src="ing.img" :alt="ing.label" class="h-8 w-8 object-contain" />
                  <span>{{ ing.label }}</span>
                </li>
              </ul>
              <div class="flex flex-wrap gap-3">
                <button
                  class="rounded-full px-6 py-3 font-display text-sm font-bold shadow-md transition-all hover:scale-105 md:text-base"
                  :class="isDarkText ? 'bg-[#2A7A72] text-white' : 'bg-[#2A7A72] text-white'"
                  @click="addToCart"
                >
                  {{ t('flavors.addToCart', { price: packPrice }) }}
                </button>
                <button
                  class="rounded-full border px-6 py-3 font-display text-sm font-bold shadow-sm transition-all hover:scale-105 md:text-base"
                  :class="isDarkText ? 'border-[#2A2018]/30 text-[#2A2018] hover:bg-white/30' : 'border-white/40 text-white hover:bg-white/15'"
                  @click="scrollTo('#story', { offset: -96 })"
                >
                  {{ t('flavors.learnMore') }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Indicadores -->
      <div class="mt-10 flex justify-center gap-2">
        <button
          v-for="(flavor, idx) in flavors"
          :key="`dot-${flavor.id}`"
          class="h-2 rounded-full transition-all duration-300"
          :class="activePanel === idx ? 'w-8 bg-white' : 'w-2 bg-white/40'"
          :aria-label="flavor.name"
          @click="selectFlavor(idx)"
        />
      </div>
    </div>

    <TropicalSplash class="md:hidden" :color="theme.activeFlavor.waveColor" simple />
    <TropicalSplash class="hidden md:block" :color="theme.activeFlavor.waveColor" animated ocean />
  </section>
</template>

<style scoped>
.flavor-enter-active, .flavor-leave-active { transition: all 0.6s ease; }
.flavor-enter-from { opacity: 0; transform: translateY(16px) scale(0.96); }
.flavor-leave-to { opacity: 0; transform: translateY(-16px) scale(0.96); }
.ing-enter-active, .ing-leave-active { transition: all 0.4s ease; }
.ing-enter-from, .ing-leave-to { opacity: 0; transform: scale(0.8); }
.flavor-float { animation: flavorFloat 4s ease-in-out infinite; }
@keyframes flavorFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-16px) rotate(5deg); }
}
</style>
