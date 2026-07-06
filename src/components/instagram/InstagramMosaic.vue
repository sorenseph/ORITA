<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useInstagram } from '../../composables/useInstagram'
import { gsap } from '../../composables/useLenis'
import BeachDecor from '../tropical/BeachDecor.vue'

const { t, locale } = useI18n()
const { displayPosts, loading, fromApi, reload } = useInstagram()
const sectionRef = ref(null)
const hoveredId = ref(null)

watch(locale, () => {
  if (!fromApi.value) reload()
})

onMounted(() => {
  gsap.from('.ig-heading', { y: 60, opacity: 0, duration: 1, scrollTrigger: { trigger: sectionRef.value, start: 'top 80%' } })
  gsap.from('.ig-item', {
    scale: 0.9, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'back.out(1.3)',
    scrollTrigger: { trigger: sectionRef.value, start: 'top 75%' },
  })
})
</script>

<template>
  <section id="instagram" ref="sectionRef" data-nav-contrast="light" class="relative overflow-hidden py-24 md:py-40">
    <BeachDecor light />
    <div class="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
      <div class="ig-heading mb-12 flex flex-col items-start justify-between gap-4 md:mb-16 md:flex-row md:items-end">
        <div>
          <p class="mb-3 font-body text-sm tracking-[0.3em] text-[#4AAB9E] uppercase">{{ t('instagram.eyebrow') }}</p>
          <h2 class="font-display text-4xl font-bold text-[#2A2018] md:text-6xl">
            {{ t('instagram.title') }}<br /><span class="gradient-text">{{ t('instagram.titleHighlight') }}</span>
          </h2>
          <p class="mt-4 max-w-md font-body text-base text-[#2A2018]/60">{{ t('instagram.intro') }}</p>
          <p v-if="loading" class="mt-2 font-body text-sm text-[#2A2018]/40">{{ t('instagram.loading') }}</p>
        </div>
        <a href="https://www.instagram.com/drinkorita/" target="_blank" rel="noopener" class="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-body text-sm text-[#2A2018]/70 shadow-sm transition-all hover:text-[#2A2018] hover:shadow-md">
          <img src="/images/instagram.png" alt="" class="h-4 w-4 opacity-70" />
          @drinkorita
        </a>
      </div>

      <div class="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        <a
          v-for="(post, i) in displayPosts"
          :key="post.id"
          :href="post.permalink || 'https://www.instagram.com/drinkorita/'"
          target="_blank"
          rel="noopener"
          class="ig-item group relative overflow-hidden rounded-2xl shadow-md"
          :class="(post.large || i === 0) ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'"
          @mouseenter="hoveredId = post.id"
          @mouseleave="hoveredId = null"
        >
          <img
            :src="post.image"
            :alt="post.caption || t('instagram.fallback')"
            class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div
            class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#2A2018]/80 via-[#2A2018]/20 to-transparent p-4 transition-opacity duration-300"
            :class="hoveredId === post.id ? 'opacity-100' : 'opacity-0'"
          >
            <p class="font-body text-xs text-white/90 md:text-sm">{{ post.caption }}</p>
            <p class="mt-1 font-body text-xs text-white/60">❤️ {{ post.likes.toLocaleString() }}</p>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
@media (hover: hover) {
  .ig-item:hover .absolute { opacity: 1; }
}
</style>
