<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { flavorVisuals } from '../../data/content'
import { useLocalizedTestimonials } from '../../composables/useLocalizedContent'
import { gsap } from '../../composables/useLenis'
import { useSectionLife } from '../../composables/useSectionLife'
import SectionAmbient from '../atmosphere/SectionAmbient.vue'
import InfiniteMarquee from '../ui/InfiniteMarquee.vue'

const { t } = useI18n()
const testimonials = useLocalizedTestimonials()
const sectionRef = ref(null)

const rowSmallA = computed(() => [...testimonials.value.slice(2), ...testimonials.value.slice(0, 2)])
const rowSmallB = computed(() => [...testimonials.value].reverse())

function getFlavorColor(flavorId) {
  return flavorVisuals.find((f) => f.id === flavorId)?.primary || '#4AAB9E'
}

useSectionLife(sectionRef)

onMounted(() => {
  gsap.from('.testimonials-heading', {
    y: 60,
    opacity: 0,
    duration: 1,
    scrollTrigger: { trigger: sectionRef.value, start: 'top 80%', once: true },
    clearProps: 'opacity,transform',
  })
})
</script>

<template>
  <section id="testimonials" ref="sectionRef" data-nav-contrast="light" class="relative overflow-hidden bg-[#F7F0E3] py-24 md:py-40">
    <SectionAmbient variant="sand" :intensity="0.25" :show-bubbles="false" />

    <div class="relative z-10 mb-10 px-5 pt-8 md:mb-14 md:px-8 md:pt-12">
      <div class="testimonials-heading mx-auto max-w-7xl">
        <p class="mb-3 font-body text-sm tracking-[0.3em] text-[#4AAB9E] uppercase">{{ t('testimonials.eyebrow') }}</p>
        <h2 class="font-display text-4xl font-bold text-[#2A2018] md:text-6xl">
          {{ t('testimonials.title') }} <span class="gradient-text">{{ t('testimonials.titleHighlight') }}</span>
        </h2>
        <p class="mt-4 max-w-lg font-body text-base text-[#2A2018]/60 md:text-lg">{{ t('testimonials.intro') }}</p>
      </div>
    </div>

    <div class="relative z-10 space-y-4 md:space-y-5">
      <InfiniteMarquee :items="testimonials" direction="left" :duration="42">
        <template #default="{ item }">
          <article class="glass-ice w-80 shrink-0 rounded-3xl p-6 md:w-96 md:p-8 life-float">
            <div class="mb-4 flex items-center gap-3">
              <img :src="item.avatar" :alt="item.name" class="h-12 w-12 rounded-full object-cover ring-2 ring-[#4AAB9E]/20" loading="lazy" />
              <div>
                <p class="font-display font-bold text-[#2A2018]">{{ item.name }}</p>
                <p class="font-body text-sm text-[#2A2018]/45">{{ item.handle }}</p>
              </div>
              <div class="ml-auto h-3 w-3 rounded-full" :style="{ background: getFlavorColor(item.flavor) }" />
            </div>
            <p class="mb-5 font-body text-sm leading-relaxed text-[#2A2018]/75 md:text-base">{{ item.text }}</p>
            <p class="font-body text-sm text-[#2A2018]/40">❤️ {{ item.likes.toLocaleString() }}</p>
          </article>
        </template>
      </InfiniteMarquee>

      <InfiniteMarquee class="hidden md:block" :items="rowSmallA" direction="right" :duration="30">
        <template #default="{ item }">
          <article class="glass-ice w-56 shrink-0 rounded-2xl p-4 md:w-64 md:p-5 life-float">
            <div class="mb-3 flex items-center gap-2.5">
              <img :src="item.avatar" :alt="item.name" class="h-9 w-9 rounded-full object-cover ring-2 ring-[#4AAB9E]/15" loading="lazy" />
              <div class="min-w-0">
                <p class="truncate font-display text-sm font-bold text-[#2A2018]">{{ item.name }}</p>
                <p class="truncate font-body text-xs text-[#2A2018]/45">{{ item.handle }}</p>
              </div>
              <div class="ml-auto h-2.5 w-2.5 shrink-0 rounded-full" :style="{ background: getFlavorColor(item.flavor) }" />
            </div>
            <p class="line-clamp-3 font-body text-xs leading-relaxed text-[#2A2018]/70 md:text-sm">{{ item.text }}</p>
          </article>
        </template>
      </InfiniteMarquee>

      <InfiniteMarquee class="hidden md:block" :items="rowSmallB" direction="left" :duration="26">
        <template #default="{ item }">
          <article class="w-52 shrink-0 rounded-2xl border border-[#2A2018]/6 bg-[#F7F0E3] p-4 md:w-60 md:p-5">
            <div class="mb-2 flex items-center gap-2">
              <img :src="item.avatar" :alt="item.name" class="h-8 w-8 rounded-full object-cover" loading="lazy" />
              <p class="truncate font-display text-xs font-bold text-[#2A2018]">{{ item.name }}</p>
              <span class="ml-auto font-body text-[10px] text-[#2A2018]/35">❤️ {{ item.likes.toLocaleString() }}</span>
            </div>
            <p class="line-clamp-2 font-body text-xs leading-relaxed text-[#2A2018]/65">{{ item.text }}</p>
          </article>
        </template>
      </InfiniteMarquee>
    </div>
  </section>
</template>
