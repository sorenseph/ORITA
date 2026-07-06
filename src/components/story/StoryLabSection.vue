<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalizedStorySteps, useLocalizedLabIngredients } from '../../composables/useLocalizedContent'
import { useMotionReveal } from '../../composables/useMotionReveal'
import { gsap } from '../../composables/useLenis'
import LottieIcon from '../ui/LottieIcon.vue'
import FluidMorphBg from '../ui/FluidMorphBg.vue'
import BeachDecor from '../tropical/BeachDecor.vue'
import SmallLeaves from '../tropical/SmallLeaves.vue'
import TropicalSplash from '../tropical/TropicalSplash.vue'
import SectionAmbient from '../atmosphere/SectionAmbient.vue'
import { useSectionLife } from '../../composables/useSectionLife'

const { t } = useI18n()
const storySteps = useLocalizedStorySteps()
const labIngredients = useLocalizedLabIngredients()
const sectionRef = ref(null)
const activeStep = ref(0)
const hoveredId = ref(null)
const autoplayRef = ref(null)
const isPaused = ref(false)
const stepCardRef = ref(null)

function selectStep(i) { activeStep.value = i }
function nextStep() { activeStep.value = (activeStep.value + 1) % storySteps.value.length }

function onCardEnter(id, e) {
  hoveredId.value = id
  gsap.to(e.currentTarget, { y: -6, scale: 1.03, duration: 0.45, ease: 'power2.out' })
}
function onCardLeave(e) {
  hoveredId.value = null
  gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.5, ease: 'power2.out' })
}

watch(activeStep, () => {
  if (!stepCardRef.value) return
  gsap.fromTo(stepCardRef.value, { scale: 0.96, opacity: 0.6 }, { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.4)' })
})

useMotionReveal(sectionRef, '.motion-reveal', { stagger: 0.06 })
useSectionLife(sectionRef)

onMounted(() => {
  autoplayRef.value = setInterval(() => { if (!isPaused.value) nextStep() }, 4500)
})
onUnmounted(() => { if (autoplayRef.value) clearInterval(autoplayRef.value) })
</script>

<template>
  <section id="story" ref="sectionRef" class="relative">
    <div class="story-brand relative overflow-hidden bg-[#3BBFA3] px-5 py-20 md:px-8 md:py-28" data-nav-contrast="dark">
      <SectionAmbient variant="tropical" :intensity="0.5" :show-particles="false" :show-bubbles="false" />
      <TropicalSplash color="#F7F0E3" flip simple />
      <BeachDecor minimal />
      <div class="content-layer mx-auto max-w-3xl text-center">
        <p class="motion-reveal mb-6 font-editorial text-lg italic text-white/90 md:text-xl">{{ t('story.brandEyebrow') }}</p>
        <h2 class="motion-reveal font-editorial text-[clamp(2rem,6vw,4.5rem)] font-semibold leading-[1.05] text-white">
          {{ t('story.brandLine1') }}<br />{{ t('story.brandLine2') }}<br />{{ t('story.brandLine3') }}
        </h2>
        <p class="motion-reveal mx-auto mt-8 max-w-lg font-body text-base text-white/80 md:text-lg">{{ t('story.brandSubline') }}</p>
      </div>
      <TropicalSplash color="#F7F0E3" animated ocean class="hidden md:block" />
    </div>

    <div class="relative py-20 md:py-32" data-nav-contrast="light">
      <SectionAmbient variant="sand" :intensity="0.35" :show-bubbles="false" :show-particles="false" />
      <SmallLeaves />
      <div class="content-layer mx-auto max-w-6xl px-5 md:px-8">
        <div class="motion-reveal mb-12 text-center md:mb-16">
          <p class="mb-3 font-body text-sm tracking-[0.3em] text-[#4AAB9E] uppercase">{{ t('story.eyebrow') }}</p>
          <h2 class="font-display text-4xl font-bold text-[#2A2018] md:text-6xl">
            {{ t('story.title') }} <span class="gradient-text">{{ t('story.titleHighlight') }}</span>{{ t('story.titleEnd') }}
          </h2>
          <p class="mx-auto mt-4 max-w-xl font-body text-[#2A2018]/65 md:text-lg">{{ t('story.subtitle') }}</p>
        </div>

        <div class="story-timeline motion-reveal" @mouseenter="isPaused = true" @mouseleave="isPaused = false">
          <div
            ref="stepCardRef"
            class="mx-auto mb-10 max-w-2xl overflow-hidden rounded-3xl glass-ice shadow-[0_16px_48px_rgba(42,32,24,0.1)] life-breathe"
            :style="{ borderTop: `4px solid ${storySteps[activeStep]?.color}` }"
          >
            <div class="flex flex-col items-center p-8 md:flex-row md:gap-10 md:p-12">
              <div
                class="mb-6 flex shrink-0 items-center justify-center overflow-hidden rounded-2xl md:mb-0"
                :style="{
                  background: `${storySteps[activeStep]?.color}12`,
                  width: `${storySteps[activeStep]?.imageSize}px`,
                  height: `${storySteps[activeStep]?.imageSize}px`,
                }"
              >
                <LottieIcon
                  v-if="storySteps[activeStep]?.lottie"
                  :key="storySteps[activeStep]?.id"
                  :src="storySteps[activeStep]?.lottie"
                  :speed="storySteps[activeStep]?.id === 'bubble' ? 0.85 : 1"
                />
                <img
                  v-else
                  :src="storySteps[activeStep]?.image"
                  :alt="storySteps[activeStep]?.label"
                  class="max-h-28 w-auto object-contain"
                  loading="lazy"
                />
              </div>
              <div class="text-center md:text-left">
                <p class="mb-1 font-body text-sm tracking-widest uppercase" :style="{ color: storySteps[activeStep]?.color }">
                  {{ String(activeStep + 1).padStart(2, '0') }} / {{ storySteps.length }}
                </p>
                <h3 class="mb-2 font-display text-3xl font-bold text-[#2A2018]">{{ storySteps[activeStep]?.label }}</h3>
                <p class="font-editorial text-xl italic text-[#2A2018]/70">{{ storySteps[activeStep]?.sublabel }}</p>
              </div>
            </div>
          </div>

          <div class="flex gap-3 overflow-x-auto pb-2 hide-scrollbar md:justify-center">
            <button
              v-for="(step, i) in storySteps"
              :key="step.id"
              class="flex shrink-0 flex-col items-center gap-2 rounded-2xl p-3 transition-all"
              :class="activeStep === i ? 'scale-105 bg-white shadow-lg' : 'bg-white/70 hover:bg-white'"
              @click="selectStep(i)"
            >
              <div
                class="flex h-14 w-14 items-center justify-center rounded-xl font-display text-lg font-bold"
                :style="{ background: `${step.color}18`, color: step.color }"
              >
                {{ String(i + 1).padStart(2, '0') }}
              </div>
              <span class="font-display text-xs font-bold text-[#2A2018]">{{ step.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div id="ingredients" class="relative overflow-hidden pb-24 md:pb-32">
      <div class="mx-auto max-w-7xl px-5 md:px-8">
        <div class="motion-reveal relative overflow-hidden rounded-3xl bg-[#1a3c38] px-5 py-14 md:px-10 md:py-20" data-nav-contrast="dark">
          <FluidMorphBg
            :colors="['#1a5c56', '#248f82', '#2A7A72', '#3d9a8e', '#4AAB9E']"
            background-color="transparent"
            blend="normal"
            :duration="5"
            :path-count="5"
            :opacity="0.32"
          />
          <div class="relative z-10">
            <div class="mb-12 md:mb-16">
              <p class="mb-3 font-body text-sm tracking-[0.3em] text-[#4AAB9E] uppercase">{{ t('lab.eyebrow') }}</p>
              <h2 class="font-display text-4xl font-bold text-white md:text-6xl">
                {{ t('lab.title') }} <span class="text-[#4AAB9E]">{{ t('lab.titleHighlight') }}</span>
              </h2>
              <p class="mt-4 max-w-xl font-body text-white/60 md:text-lg">{{ t('lab.intro') }}</p>
            </div>
            <div
              class="peek-carousel -mx-5 hide-scrollbar md:mx-0 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3"
              data-lenis-prevent
            >
              <div
                v-for="(ing, i) in labIngredients"
                :key="ing.id"
                class="peek-carousel__card motion-reveal group cursor-pointer rounded-2xl glass-ice p-5 transition-shadow md:p-7"
                :style="{ boxShadow: hoveredId === ing.id ? `0 12px 40px ${ing.color}25` : 'none' }"
                @mouseenter="onCardEnter(ing.id, $event)"
                @mouseleave="onCardLeave($event)"
              >
                <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl font-display text-sm font-bold" :style="{ background: `${ing.color}22`, color: ing.color }">
                  {{ String(i + 1).padStart(2, '0') }}
                </div>
                <h3 class="mb-2 font-display text-lg font-bold text-white">{{ ing.name }}</h3>
                <p class="font-body text-sm text-white/70">{{ ing.benefit }}</p>
                <p class="mt-2 line-clamp-2 font-body text-xs text-white/50">{{ ing.detail }}</p>
              </div>
            </div>
            <p class="mt-3 text-center font-body text-[11px] tracking-wide text-white/35 md:hidden">{{ t('lab.swipeHint') }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.step-enter-active, .step-leave-active { transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1); }
.step-enter-from { opacity: 0; transform: translateY(20px); }
.step-leave-to { opacity: 0; transform: translateY(-16px); }
</style>
