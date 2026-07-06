<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalizedBenefits } from '../../composables/useLocalizedContent'
import { gsap } from '../../composables/useLenis'
import { countUp } from '../../composables/useAnimations'
import BeachDecor from '../tropical/BeachDecor.vue'
import TropicalSplash from '../tropical/TropicalSplash.vue'

const { t } = useI18n()
const benefits = useLocalizedBenefits()
const sectionRef = ref(null)
const statRefs = ref([])

onMounted(() => {
  gsap.from('.benefits-heading', { y: 60, opacity: 0, duration: 1, scrollTrigger: { trigger: sectionRef.value, start: 'top 80%', once: true }, clearProps: 'opacity,transform' })
  gsap.from('.benefit-card', { y: 40, opacity: 0, duration: 0.7, stagger: 0.1, scrollTrigger: { trigger: sectionRef.value, start: 'top 75%', once: true }, clearProps: 'opacity,transform' })
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
  <section id="benefits" ref="sectionRef" data-nav-contrast="light" class="relative overflow-hidden py-24 md:py-40">
    <BeachDecor light minimal />
    <div class="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
      <div class="benefits-heading mb-16 text-center md:mb-20">
        <p class="mb-3 font-body text-sm tracking-[0.3em] text-[#4AAB9E] uppercase">{{ t('benefits.eyebrow') }}</p>
        <h2 class="font-display text-4xl font-bold text-[#2A2018] md:text-6xl">
          {{ t('benefits.title') }} <span class="gradient-text">{{ t('benefits.titleHighlight') }}</span>
        </h2>
        <p class="mx-auto mt-4 max-w-lg font-body text-base text-[#2A2018]/60 md:text-lg">{{ t('benefits.intro') }}</p>
      </div>
      <div class="grid gap-5 sm:grid-cols-2">
        <div
          v-for="(benefit, i) in benefits"
          :key="benefit.id"
          class="benefit-card group relative overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02] md:p-10"
          :style="{ background: benefit.bg, border: `1px solid ${benefit.accent}22` }"
        >
          <div class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl opacity-30 transition-opacity group-hover:opacity-50" :style="{ background: benefit.accent }" aria-hidden="true" />
          <div class="relative z-10">
            <div class="mb-6 flex items-end gap-2">
              <span :ref="(el) => (statRefs[i] = el)" class="font-display text-5xl font-extrabold leading-none md:text-8xl" :style="{ color: benefit.accent }">{{ benefit.stat }}</span>
              <span class="mb-2 font-display text-xl font-bold text-[#2A2018]/50 md:text-2xl">{{ benefit.unit }}</span>
            </div>
            <h3 class="mb-2 font-display text-2xl font-bold text-[#2A2018] md:text-3xl">{{ benefit.title }}</h3>
            <p class="font-body text-sm text-[#2A2018]/60 md:text-base">{{ benefit.description }}</p>
          </div>
          <div class="absolute bottom-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500 group-hover:scale-125" :style="{ background: `${benefit.accent}22`, color: benefit.accent }">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
          </div>
        </div>
      </div>
    </div>
    <TropicalSplash class="md:hidden" color="#2A7A72" simple />
    <TropicalSplash class="hidden md:block" color="#2A7A72" />
  </section>
</template>
