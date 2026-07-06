<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalizedBenefits } from '../../composables/useLocalizedContent'
import { gsap } from '../../composables/useLenis'
import { countUp } from '../../composables/useAnimations'
import { useSectionLife } from '../../composables/useSectionLife'
import BeachDecor from '../tropical/BeachDecor.vue'
import SmallLeaves from '../tropical/SmallLeaves.vue'
import SectionAmbient from '../atmosphere/SectionAmbient.vue'

const { t } = useI18n()
const benefits = useLocalizedBenefits()
const sectionRef = ref(null)
const statRefs = ref([])
const activeSlide = ref(0)

useSectionLife(sectionRef)

function onCarouselScroll(e) {
  const el = e.target
  const card = el.querySelector('.benefit-card')
  if (!card) return
  const gap = 16
  const step = card.offsetWidth + gap
  activeSlide.value = Math.round(el.scrollLeft / step)
}

onMounted(() => {
  gsap.from('.benefits-heading > *', {
    y: 50, opacity: 0, duration: 1, stagger: 0.08,
    scrollTrigger: { trigger: sectionRef.value, start: 'top 80%', once: true },
    clearProps: 'opacity,transform',
  })
  gsap.from('.benefit-card', {
    y: 40, opacity: 0, duration: 0.8, stagger: 0.12,
    scrollTrigger: { trigger: sectionRef.value, start: 'top 75%', once: true },
    clearProps: 'opacity,transform',
  })
  benefits.value.forEach((b, i) => {
    const el = statRefs.value[i]
    if (!el) return
    if (b.stat !== '0' && b.stat !== '100') {
      countUp(el, parseFloat(b.stat), { decimals: b.stat.includes('.') ? 1 : 0 })
    }
  })
})
</script>

<template>
  <section id="benefits" ref="sectionRef" data-nav-contrast="light" class="relative overflow-hidden py-16 md:py-40">
    <SectionAmbient variant="sand" :intensity="0.4" />
    <SmallLeaves />
    <BeachDecor light minimal />
    <div class="content-layer relative z-10 mx-auto max-w-7xl px-5 md:px-8">
      <div class="benefits-heading mb-8 text-center md:mb-20">
        <p class="mb-3 font-body text-sm tracking-[0.3em] text-[#4AAB9E] uppercase">{{ t('benefits.eyebrow') }}</p>
        <h2 class="font-display text-3xl font-bold text-[#2A2018] md:text-6xl">
          {{ t('benefits.title') }} <span class="gradient-text">{{ t('benefits.titleHighlight') }}</span>
        </h2>
        <p class="mx-auto mt-3 max-w-lg font-body text-sm text-[#2A2018]/60 md:mt-4 md:text-lg">{{ t('benefits.intro') }}</p>
      </div>

      <div
        class="peek-carousel -mx-5 hide-scrollbar md:mx-0 md:grid md:grid-cols-2 md:gap-5"
        data-lenis-prevent
        @scroll="onCarouselScroll"
      >
        <div
          v-for="(benefit, i) in benefits"
          :key="benefit.id"
          class="peek-carousel__card benefit-card glass-ice group relative overflow-hidden rounded-3xl p-6 transition-all duration-500 md:p-10"
          :style="{ borderColor: `${benefit.accent}33` }"
        >
          <div
            class="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl opacity-30 md:h-40 md:w-40"
            :style="{ background: benefit.accent }"
            aria-hidden="true"
          />
          <div class="relative z-10">
            <div class="mb-4 flex items-end gap-2 md:mb-6">
              <span :ref="(el) => (statRefs[i] = el)" class="font-display text-4xl font-extrabold leading-none md:text-8xl" :style="{ color: benefit.accent }">{{ benefit.stat }}</span>
              <span class="mb-1 font-display text-lg font-bold text-[#2A2018]/50 md:mb-2 md:text-2xl">{{ benefit.unit }}</span>
            </div>
            <h3 class="mb-2 font-display text-xl font-bold text-[#2A2018] md:text-3xl">{{ benefit.title }}</h3>
            <p class="font-body text-sm text-[#2A2018]/60 md:text-base">{{ benefit.description }}</p>
          </div>
          <div class="absolute bottom-5 right-5 z-10 flex h-9 w-9 items-center justify-center rounded-full md:bottom-6 md:right-6 md:h-10 md:w-10" :style="{ background: `${benefit.accent}22`, color: benefit.accent }">
            <svg class="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
          </div>
        </div>
      </div>

      <div class="mt-4 flex justify-center gap-1.5 md:hidden">
        <span
          v-for="(_, i) in benefits"
          :key="i"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="activeSlide === i ? 'w-6 bg-[#4AAB9E]' : 'w-1.5 bg-[#2A2018]/15'"
        />
      </div>
      <p class="mt-2 text-center font-body text-[11px] tracking-wide text-[#2A2018]/35 md:hidden">{{ t('benefits.swipeHint') }}</p>
    </div>
  </section>
</template>
