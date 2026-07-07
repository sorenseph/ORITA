<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalizedStorySteps, useLocalizedLabIngredients } from '../../composables/useLocalizedContent'
import { gsap } from '../../composables/useLenis'
import BeachDecor from '../tropical/BeachDecor.vue'
import TropicalSplash from '../tropical/TropicalSplash.vue'
import StoryNarrativePipe from './StoryNarrativePipe.vue'
import { useSectionLife } from '../../composables/useSectionLife'

const { t } = useI18n()
const storySteps = useLocalizedStorySteps()
const labIngredients = useLocalizedLabIngredients()
const sectionRef = ref(null)
const activeStep = ref(0)
const hoveredId = ref(null)

function onCardEnter(id, e) {
  hoveredId.value = id
  gsap.to(e.currentTarget, { y: -6, scale: 1.02, duration: 0.45, ease: 'power3.out' })
}
function onCardLeave(e) {
  hoveredId.value = null
  gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.55, ease: 'power3.out' })
}

useSectionLife(sectionRef)
</script>

<template>
  <section id="story" ref="sectionRef" class="relative">
    <div class="relative overflow-hidden bg-[#3BBFA3] px-5 py-20 md:px-8 md:py-28" data-nav-contrast="dark">
      <TropicalSplash color="#F7F0E3" flip simple />
      <BeachDecor minimal />
      <div class="content-layer mx-auto max-w-3xl text-center">
        <p class="mb-6 font-editorial text-lg italic text-white/90 md:text-xl">{{ t('story.brandEyebrow') }}</p>
        <h2 class="font-editorial text-[clamp(2rem,6vw,4.5rem)] font-semibold leading-[1.05] text-white">
          {{ t('story.brandLine1') }}<br />{{ t('story.brandLine2') }}<br />{{ t('story.brandLine3') }}
        </h2>
        <p class="mx-auto mt-8 max-w-lg font-body text-base text-white/80 md:text-lg">{{ t('story.brandSubline') }}</p>
      </div>
    </div>

    <div class="relative bg-[#F7F0E3] py-20 md:py-32" data-nav-contrast="light">
      <div class="content-layer mx-auto max-w-6xl px-5 md:px-8">
        <div class="mb-12 text-center md:mb-16">
          <p class="mb-3 font-body text-sm tracking-[0.3em] text-[#2A7A72] uppercase">{{ t('story.eyebrow') }}</p>
          <h2 class="font-display text-4xl font-bold text-[#2A2018] md:text-6xl">
            {{ t('story.title') }} <span class="text-[#2A7A72]">{{ t('story.titleHighlight') }}</span>{{ t('story.titleEnd') }}
          </h2>
          <p class="mx-auto mt-4 max-w-xl font-body text-[#2A2018]/65 md:text-lg">{{ t('story.subtitle') }}</p>
        </div>

        <div
          class="mx-auto mb-12 max-w-md rounded-2xl bg-white p-6 text-center shadow-[0_8px_32px_rgba(42,32,24,0.08)] md:mb-16 md:hidden"
          :style="{ borderTop: `4px solid ${storySteps[activeStep]?.color}` }"
        >
          <p class="mb-1 font-body text-xs tracking-widest uppercase" :style="{ color: storySteps[activeStep]?.color }">
            {{ String(activeStep + 1).padStart(2, '0') }} / {{ storySteps.length }}
          </p>
          <h3 class="font-display text-2xl font-bold text-[#2A2018]">{{ storySteps[activeStep]?.label }}</h3>
          <p class="font-editorial text-lg italic text-[#2A2018]/70">{{ storySteps[activeStep]?.sublabel }}</p>
        </div>

        <StoryNarrativePipe :steps="storySteps" class="hidden md:block" />

        <div class="flex gap-2 overflow-x-auto pb-2 hide-scrollbar md:hidden">
          <button
            v-for="(step, i) in storySteps"
            :key="step.id"
            type="button"
            class="flex shrink-0 flex-col items-center gap-1.5 rounded-2xl px-3 py-2 transition-all"
            :class="activeStep === i ? 'bg-white shadow-md' : 'bg-white/80'"
            @click="activeStep = i"
          >
            <span class="font-display text-[10px] font-bold" :style="{ color: step.color }">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="font-display text-xs font-bold text-[#2A2018]">{{ step.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <div id="ingredients" class="bg-[#1A3C38] px-5 py-16 md:px-8 md:py-24" data-nav-contrast="dark">
      <div class="content-layer mx-auto max-w-7xl">
        <div class="mb-10 md:mb-14">
          <p class="mb-3 font-body text-sm tracking-[0.3em] text-[#E8C84A] uppercase">{{ t('lab.eyebrow') }}</p>
          <h2 class="font-display text-4xl font-bold text-white md:text-6xl">
            {{ t('lab.title') }} <span class="text-[#E8C84A]">{{ t('lab.titleHighlight') }}</span>
          </h2>
          <p class="mt-4 max-w-xl font-body text-white/75 md:text-lg">{{ t('lab.intro') }}</p>
        </div>

        <div class="peek-carousel -mx-5 hide-scrollbar md:mx-0 md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          <article
            v-for="ing in labIngredients"
            :key="ing.id"
            class="peek-carousel__card group cursor-pointer rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.12)] transition-shadow md:p-7"
            :style="{
              background: ing.cardBg,
              boxShadow: hoveredId === ing.id ? `0 12px 40px ${ing.accent}33` : undefined,
            }"
            @mouseenter="onCardEnter(ing.id, $event)"
            @mouseleave="onCardLeave($event)"
          >
            <div
              class="mb-4 flex items-end justify-center overflow-hidden rounded-xl"
              :class="ing.imgSize === 'large' ? 'h-24 w-full max-w-[140px] md:h-28 md:max-w-[160px]' : 'h-16 w-16 md:h-20 md:w-20'"
              :style="{ background: `${ing.accent}18` }"
            >
              <img
                :src="ing.img"
                :alt="ing.name"
                class="object-contain object-bottom"
                :class="ing.imgSize === 'large' ? 'h-full w-full max-h-[88px] md:max-h-[104px]' : 'h-12 w-12 md:h-14 md:w-14'"
                loading="lazy"
              />
            </div>
            <div>
              <h3 class="mb-2 font-display text-lg font-bold text-[#2A2018] md:text-xl">{{ ing.name }}</h3>
              <p class="font-body text-sm font-medium text-[#2A2018]/80 md:text-base">{{ ing.benefit }}</p>
              <p class="mt-2 font-body text-xs leading-relaxed text-[#2A2018]/55 md:text-sm">{{ ing.detail }}</p>
            </div>
          </article>
        </div>
        <p class="mt-3 text-center font-body text-[11px] tracking-wide text-white/40 md:hidden">{{ t('lab.swipeHint') }}</p>
      </div>
    </div>
  </section>
</template>
