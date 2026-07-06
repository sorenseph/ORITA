<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { gsap, ScrollTrigger } from '../../composables/useLenis'
import LottieIcon from '../ui/LottieIcon.vue'

const props = defineProps({
  steps: { type: Array, required: true },
})

const emit = defineEmits(['active'])

const pipeRef = ref(null)
const activeIndex = ref(0)
let ctx

const activeStep = computed(() => props.steps[activeIndex.value])

onMounted(() => {
  if (!pipeRef.value || !props.steps.length) return

  ctx = gsap.context(() => {
    const nodes = pipeRef.value.querySelectorAll('[data-pipe-node]')

    ScrollTrigger.create({
      trigger: pipeRef.value,
      start: 'top 65%',
      end: 'bottom 35%',
      scrub: 0.8,
      onUpdate: (self) => {
        const idx = Math.min(
          props.steps.length - 1,
          Math.floor(self.progress * props.steps.length),
        )
        if (idx !== activeIndex.value) {
          activeIndex.value = idx
          emit('active', idx)
        }
      },
    })

    nodes.forEach((node, i) => {
      gsap.from(node, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: node, start: 'top 88%', once: true },
      })
    })
  }, pipeRef)
})

watch(activeIndex, (idx) => {
  const nodes = pipeRef.value?.querySelectorAll('[data-pipe-node]')
  if (!nodes) return
  nodes.forEach((node, i) => {
    gsap.to(node, {
      scale: i === idx ? 1.04 : 1,
      opacity: i === idx ? 1 : 0.45,
      duration: 0.55,
      ease: 'power3.out',
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <div ref="pipeRef" class="story-pipe relative mx-auto max-w-xl">
    <div
      class="story-pipe__line absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#4AAB9E]/20 via-[#4AAB9E]/50 to-[#4AAB9E]/20 md:left-8"
      aria-hidden="true"
    />

    <article
      v-for="(step, i) in steps"
      :key="step.id"
      data-pipe-node
      class="story-pipe__node relative mb-10 flex items-start gap-5 pl-14 md:mb-12 md:gap-6 md:pl-20"
      :class="i === activeIndex ? 'story-pipe__node--active' : ''"
    >
      <div
        class="absolute left-3 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-500 md:left-5 md:h-9 md:w-9"
        :style="{
          borderColor: step.color,
          background: i <= activeIndex ? step.color : 'white',
          boxShadow: i === activeIndex ? `0 0 24px ${step.color}55` : 'none',
        }"
      >
        <span class="font-display text-[10px] font-bold text-white md:text-xs">{{ String(i + 1).padStart(2, '0') }}</span>
      </div>

      <div
        class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl md:h-20 md:w-20"
        :style="{ background: `${step.color}14` }"
      >
        <LottieIcon
          v-if="step.lottie"
          :src="step.lottie"
          :speed="step.id === 'bubble' ? 0.85 : 1"
          class="h-14 w-14 md:h-16 md:w-16"
        />
        <img v-else-if="step.image" :src="step.image" :alt="step.label" class="h-12 w-12 object-contain md:h-14 md:w-14" loading="lazy" />
      </div>

      <div class="pt-1">
        <h3 class="font-display text-xl font-bold text-[#2A2018] md:text-2xl">{{ step.label }}</h3>
        <p class="font-editorial text-lg italic text-[#2A2018]/65 md:text-xl">{{ step.sublabel }}</p>
      </div>
    </article>

    <div
      v-if="activeStep"
      class="story-pipe__glow pointer-events-none absolute -right-8 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full blur-3xl opacity-40 md:-right-16 md:h-56 md:w-56"
      :style="{ background: activeStep.color }"
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
.story-pipe__node {
  will-change: transform, opacity;
  transition: opacity 0.4s ease;
}
</style>
