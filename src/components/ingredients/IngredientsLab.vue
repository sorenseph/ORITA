<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalizedLabIngredients } from '../../composables/useLocalizedContent'
import { gsap } from '../../composables/useLenis'
import BeachDecor from '../tropical/BeachDecor.vue'

const { t } = useI18n()
const labIngredients = useLocalizedLabIngredients()
const sectionRef = ref(null)
const cardsRef = ref([])
const hoveredId = ref(null)

function onCardEnter(id, e) {
  hoveredId.value = id
  gsap.to(e.currentTarget, { scale: 1.04, y: -8, duration: 0.5, ease: 'power2.out' })
}

function onCardLeave(e) {
  hoveredId.value = null
  gsap.to(e.currentTarget, { scale: 1, y: 0, duration: 0.6, ease: 'power2.out' })
}

onMounted(() => {
  gsap.from('.lab-heading', { y: 60, opacity: 0, duration: 1, scrollTrigger: { trigger: sectionRef.value, start: 'top 80%' } })
  cardsRef.value.forEach((el, i) => {
    if (!el) return
    gsap.from(el, {
      y: 50, opacity: 0, duration: 0.8, delay: i * 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    })
  })
})
</script>

<template>
  <section id="ingredients" ref="sectionRef" class="relative overflow-hidden py-24 md:py-40">
    <BeachDecor light />
    <div class="pointer-events-none absolute inset-0 opacity-[0.02]" aria-hidden="true" style="background-image: radial-gradient(circle, rgba(255,200,100,.8) 1px, transparent 1px); background-size: 40px 40px;" />
    <div class="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
      <div class="section-dark rounded-3xl bg-[#1a3c38] px-5 py-16 md:px-10 md:py-20">
      <div class="lab-heading mb-12 md:mb-16">
        <p class="mb-3 font-body text-sm tracking-[0.3em] text-[#4AAB9E] uppercase">{{ t('lab.eyebrow') }}</p>
        <h2 class="font-display text-4xl font-bold text-white md:text-6xl lg:text-7xl">
          {{ t('lab.title') }}<br /><span class="text-[#4AAB9E]">{{ t('lab.titleHighlight') }}</span>
        </h2>
        <p class="mt-4 max-w-xl font-body text-base text-white/60 md:text-lg">{{ t('lab.intro') }}</p>
      </div>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(ing, i) in labIngredients"
          :key="ing.id"
          :ref="(el) => (cardsRef[i] = el)"
          class="group relative cursor-pointer overflow-hidden rounded-3xl bg-white/10 p-6 backdrop-blur-sm md:p-8"
          :style="{ boxShadow: hoveredId === ing.id ? `0 16px 48px ${ing.color}22` : 'none' }"
          @mouseenter="onCardEnter(ing.id, $event)"
          @mouseleave="onCardLeave($event)"
        >
          <div class="absolute -right-4 -top-4 h-24 w-24 rounded-full blur-2xl transition-opacity duration-500" :style="{ background: ing.color, opacity: hoveredId === ing.id ? 0.3 : 0.12 }" aria-hidden="true" />
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold transition-transform duration-500 group-hover:scale-110" :style="{ background: `${ing.color}18`, color: ing.color }">
            {{ String(i + 1).padStart(2, '0') }}
          </div>
          <h3 class="mb-2 font-display text-xl font-bold text-white md:text-2xl">{{ ing.name }}</h3>
          <p class="mb-3 font-body text-sm text-white/70 md:text-base">{{ ing.benefit }}</p>
          <div class="overflow-hidden transition-all duration-500" :class="hoveredId === ing.id ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'">
            <p class="font-body text-sm text-white/80">{{ ing.detail }}</p>
          </div>
          <div class="absolute bottom-0 left-0 h-1 transition-all duration-500" :style="{ background: ing.color, width: hoveredId === ing.id ? '100%' : '0%' }" aria-hidden="true" />
        </div>
      </div>
      </div>
    </div>
  </section>
</template>
