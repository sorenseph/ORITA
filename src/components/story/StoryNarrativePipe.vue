<script setup>
import LottieIcon from '../ui/LottieIcon.vue'

defineProps({
  steps: { type: Array, required: true },
})
</script>

<template>
  <div class="story-pipe relative mx-auto max-w-xl">
    <div
      class="story-pipe__line absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#4AAB9E]/20 via-[#4AAB9E]/50 to-[#4AAB9E]/20 md:left-8"
      aria-hidden="true"
    />

    <article
      v-for="(step, i) in steps"
      :key="step.id"
      class="story-pipe__node relative mb-10 flex items-start gap-5 pl-14 md:mb-12 md:gap-6 md:pl-20"
    >
      <div
        class="absolute left-3 flex h-7 w-7 items-center justify-center rounded-full border-2 md:left-5 md:h-9 md:w-9"
        :style="{
          borderColor: step.color,
          background: step.color,
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
  </div>
</template>
