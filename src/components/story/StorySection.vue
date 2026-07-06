<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalizedStorySteps } from '../../composables/useLocalizedContent'
import { gsap } from '../../composables/useLenis'
import BeachDecor from '../tropical/BeachDecor.vue'
import TropicalSplash from '../tropical/TropicalSplash.vue'

const { t } = useI18n()
const storySteps = useLocalizedStorySteps()
const sectionRef = ref(null)
const activeStep = ref(0)
const autoplayRef = ref(null)
const isPaused = ref(false)

function startAutoplay() {
  if (autoplayRef.value) clearInterval(autoplayRef.value)
  autoplayRef.value = setInterval(() => {
    if (!isPaused.value) nextStep()
  }, 4000)
}

function selectStep(index) {
  activeStep.value = index
}

function nextStep() {
  activeStep.value = (activeStep.value + 1) % storySteps.value.length
}

onMounted(() => {
  gsap.from('.story-brand', { y: 50, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.story-brand', start: 'top 85%' } })
  gsap.from('.story-heading', { y: 60, opacity: 0, duration: 1, scrollTrigger: { trigger: sectionRef.value, start: 'top 80%' } })
  gsap.from('.story-step', {
    y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: '.story-timeline', start: 'top 75%', once: true },
    clearProps: 'opacity,transform',
  })

  startAutoplay()
})

onUnmounted(() => {
  if (autoplayRef.value) clearInterval(autoplayRef.value)
})
</script>

<template>
  <section id="story" ref="sectionRef" class="relative">
    <div class="story-brand relative overflow-hidden bg-[#3BBFA3] px-5 py-20 md:px-8 md:py-28">
      <BeachDecor />
      <div class="tropical-grain pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden="true" />
      <div class="relative z-10 mx-auto max-w-3xl text-center">
        <p class="mb-6 font-editorial text-lg italic text-white/90 md:text-xl">{{ t('story.brandEyebrow') }}</p>
        <h2 class="font-editorial text-[clamp(2rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-tight text-white">
          {{ t('story.brandLine1') }}<br />
          {{ t('story.brandLine2') }}<br />
          {{ t('story.brandLine3') }}
        </h2>
        <p class="mx-auto mt-8 max-w-lg font-body text-base text-white/80 md:text-lg">{{ t('story.brandSubline') }}</p>
      </div>
      <TropicalSplash color="#F7F0E3" />
    </div>

    <div class="relative py-24 md:py-40">
      <BeachDecor light />
      <div class="relative z-10 mx-auto max-w-6xl px-5 md:px-8">
        <div class="story-heading mb-12 text-center md:mb-16">
          <p class="mb-3 font-body text-sm tracking-[0.3em] text-[#4AAB9E] uppercase">{{ t('story.eyebrow') }}</p>
          <h2 class="font-display text-4xl font-bold text-[#2A2018] md:text-6xl lg:text-7xl">
            {{ t('story.title') }} <span class="gradient-text">{{ t('story.titleHighlight') }}</span>{{ t('story.titleEnd') }}
          </h2>
          <p class="mx-auto mt-6 max-w-xl font-body text-base text-[#2A2018]/65 md:text-lg">{{ t('story.subtitle') }}</p>
        </div>

        <!-- Timeline dinámico -->
        <div class="story-timeline" @mouseenter="isPaused = true" @mouseleave="isPaused = false">
          <!-- Paso activo grande -->
          <Transition name="step" mode="out-in">
            <div
              :key="storySteps[activeStep]?.id"
              class="story-step mx-auto mb-10 max-w-2xl rounded-3xl bg-white p-8 shadow-[0_12px_48px_rgba(42,32,24,0.1)] md:p-12"
              :style="{ borderTop: `4px solid ${storySteps[activeStep]?.color}` }"
            >
              <div class="flex flex-col items-center text-center md:flex-row md:gap-10 md:text-left">
                <div
                  class="mb-6 flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl md:mb-0"
                  :style="{ background: `${storySteps[activeStep]?.color}15` }"
                >
                  <img
                    :src="storySteps[activeStep]?.image"
                    :alt="storySteps[activeStep]?.label"
                    class="object-contain drop-shadow-md"
                    :style="{ width: `${storySteps[activeStep]?.imageSize}px`, height: `${storySteps[activeStep]?.imageSize}px` }"
                    loading="lazy"
                  />
                </div>
                <div>
                  <p class="mb-1 font-body text-sm tracking-widest uppercase" :style="{ color: storySteps[activeStep]?.color }">
                    {{ String(activeStep + 1).padStart(2, '0') }} / {{ String(storySteps.length).padStart(2, '0') }}
                  </p>
                  <h3 class="mb-2 font-display text-3xl font-bold text-[#2A2018] md:text-4xl">
                    {{ storySteps[activeStep]?.label }}
                  </h3>
                  <p class="font-editorial text-xl italic text-[#2A2018]/70 md:text-2xl">
                    {{ storySteps[activeStep]?.sublabel }}
                  </p>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Selector horizontal -->
          <div class="flex gap-3 overflow-x-auto pb-2 hide-scrollbar md:justify-center">
            <button
              v-for="(step, i) in storySteps"
              :key="step.id"
              class="story-step flex shrink-0 flex-col items-center gap-2 rounded-2xl p-4 transition-all duration-300"
              :class="activeStep === i ? 'bg-white shadow-lg scale-105' : 'bg-white/60 hover:bg-white/80'"
              @click="selectStep(i)"
            >
              <div
                class="flex h-16 w-16 items-center justify-center rounded-xl"
                :style="{ background: `${step.color}18` }"
              >
                <img
                  :src="step.image"
                  :alt="step.label"
                  class="h-10 w-10 object-contain"
                  loading="lazy"
                />
              </div>
              <span class="font-display text-xs font-bold text-[#2A2018] md:text-sm">{{ step.label }}</span>
            </button>
          </div>

          <!-- Línea conectora decorativa -->
          <div class="mt-8 hidden items-center justify-center gap-0 md:flex" aria-hidden="true">
            <template v-for="(step, i) in storySteps" :key="`line-${step.id}`">
              <div
                class="flex h-14 w-14 items-center justify-center rounded-full transition-all duration-500"
                :class="i <= activeStep ? 'scale-110' : 'opacity-40'"
                :style="{ background: `${step.color}${i <= activeStep ? '' : '55'}`, backgroundColor: i <= activeStep ? step.color : `${step.color}33` }"
              >
                <img :src="step.image" alt="" class="h-8 w-8 object-contain brightness-0 invert" :class="i <= activeStep ? '' : 'opacity-60'" />
              </div>
              <div v-if="i < storySteps.length - 1" class="h-1 w-12 rounded-full transition-all duration-500" :class="i < activeStep ? 'bg-[#4AAB9E]' : 'bg-[#4AAB9E]/25'" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.step-enter-active, .step-leave-active { transition: all 0.45s ease; }
.step-enter-from { opacity: 0; transform: translateX(24px); }
.step-leave-to { opacity: 0; transform: translateX(-24px); }
</style>
